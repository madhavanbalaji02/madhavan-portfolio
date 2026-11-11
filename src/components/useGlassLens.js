import { useRef, useCallback, useEffect, useLayoutEffect } from 'react';

// A Liquid Glass selection "lens", modelled on the iOS 26 tab bar, shared by the
// Tech News tabs and the navbar. Touch the selected item and it lifts into clear glass
// that magnifies what is beneath; slide (from anywhere on the bar) and it tracks the
// finger; release or flick and it springs onto an item. Taps slide it across with the
// same physics.
//
// The motion uses Apple's own published formulas:
//  - Springs are SwiftUI's presets, converted with Apple's response/damping-fraction
//    definition for a unit mass: stiffness = (2π / response)², damping = 4π·ζ / response.
//      tracking → .interactiveSpring()  (response 0.15, ζ 0.86)
//      settling → .snappy               (response 0.5,  bounce 0.15 → ζ 0.85)
//      lift     → .bouncy               (response 0.5,  bounce 0.3  → ζ 0.7)
//  - Flicks choose an item by projecting the release velocity with UIScrollView's normal
//    deceleration rate (0.998), as in WWDC18 "Designing Fluid Interfaces".
//  - Dragging past either end rubber-bands with UIScrollView's formula
//    (1 − 1 / (x·0.55 / d + 1)) · d, with d = 22 px so it never leaves the bar.
//  - The spring keeps the gesture's velocity on release, so there is no hitch.
// (Apple doesn't publish the tab bar's own tuning; these are its standard curves.)
//
// It runs on requestAnimationFrame and writes styles directly; dragging never
// re-renders React. The caller renders the bar, its items, and inside the bar:
//   <span className="glass-lens" ref={lensRef}><span className="glass-lens-content"
//     ref={contentRef}>{copies of the items, each with ref={ghostRef(key)}}</span></span>
// The lens scales the copies with itself, giving the magnified look through the glass.

const appleSpring = (response, dampingFraction) => ({
  k: (2 * Math.PI / response) ** 2,
  c: (4 * Math.PI * dampingFraction) / response,
});
const SPRING = {
  track:  appleSpring(0.15, 0.86),
  settle: appleSpring(0.5, 0.85),
  lift:   appleSpring(0.5, 0.7),
};
const LIFT = 1.2;
const DECELERATION = 0.998;
const RUBBER_BAND = 22;
const project = (velocity) => (velocity / 1000) * DECELERATION / (1 - DECELERATION);
const rubberBand = (over, d) => (1 - 1 / ((Math.abs(over) * 0.55) / d + 1)) * d * Math.sign(over);
const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function useGlassLens({ keys, active, onSelect, enabled }) {
  const barRef     = useRef(null);
  const lensRef    = useRef(null);
  const contentRef = useRef(null);
  const items      = useRef({});
  const ghosts     = useRef({});
  const drag       = useRef(null);
  const fromDrag   = useRef(false);
  const activeRef  = useRef(active);
  activeRef.current = active;
  // c = lens centre, w = width, s = scale; v* = velocities, t* = targets
  const anim = useRef(null);
  if (!anim.current) {
    anim.current = { c: 0, w: 0, s: 1, vc: 0, vw: 0, vs: 0, tc: 0, tw: 0, ts: 1, spring: SPRING.settle, raf: 0, last: 0, ready: false };
  }

  const keysKey = keys.join('|');
  const lift = (on) => barRef.current?.classList.toggle('is-lifted', on);

  // Sub-pixel item geometry relative to the bar's padding box
  const rectOf = useCallback((key) => {
    const el = items.current[key], bar = barRef.current;
    if (!el || !bar) return null;
    const b = bar.getBoundingClientRect(), r = el.getBoundingClientRect();
    const x = r.left - b.left - bar.clientLeft, y = r.top - b.top - bar.clientTop;
    return { x, y, w: r.width, h: r.height, c: x + r.width / 2 };
  }, []);

  const paint = useCallback(() => {
    const a = anim.current, lens = lensRef.current, content = contentRef.current;
    if (!lens || !content) return;
    // Speed stretches the glass along the direction of travel and thins it slightly
    const stretch = Math.min(0.2, Math.abs(a.vc) / 3000);
    const sx = a.s * (1 + stretch), sy = a.s * (1 - stretch * 0.4);
    const x = a.c - a.w / 2;
    lens.style.width = `${a.w}px`;
    lens.style.transform = `translate3d(${x}px,0,0) scale(${sx},${sy})`;
    // A plain 2D translate keeps the copy painted inside the lens's own layer; a separate
    // composited child inside a rounded, clipped box can vanish in iOS Safari.
    content.style.transform = `translate(${-x}px,${-lens.offsetTop}px)`;
  }, []);

  const tick = useCallback((t) => {
    const a = anim.current;
    const dt = Math.min(1 / 30, a.last ? (t - a.last) / 1000 : 1 / 60);
    a.last = t;
    const n = 8, h = dt / n;  // small sub-steps keep the stiff tracking spring stable
    for (let i = 0; i < n; i++) {
      const { k, c } = a.spring, L = SPRING.lift;
      a.vc += (-k * (a.c - a.tc) - c * a.vc) * h; a.c += a.vc * h;
      a.vw += (-k * (a.w - a.tw) - c * a.vw) * h; a.w += a.vw * h;
      a.vs += (-L.k * (a.s - a.ts) - L.c * a.vs) * h; a.s += a.vs * h;
    }
    const still = Math.abs(a.c - a.tc) < 0.02 && Math.abs(a.vc) < 0.5
      && Math.abs(a.w - a.tw) < 0.02 && Math.abs(a.vw) < 0.5
      && Math.abs(a.s - a.ts) < 0.0005 && Math.abs(a.vs) < 0.01;
    if (still) {
      Object.assign(a, { c: a.tc, w: a.tw, s: a.ts, vc: 0, vw: 0, vs: 0, raf: 0, last: 0 });
      if (!drag.current && a.ts === 1) lift(false);
    } else {
      a.raf = requestAnimationFrame(tick);
    }
    paint();
  }, [paint]);

  const animateTo = useCallback((c, w, s, spring) => {
    const a = anim.current;
    if (reduced()) {
      Object.assign(a, { c, w, s: 1, tc: c, tw: w, ts: 1, vc: 0, vw: 0, vs: 0 });
      lift(false);
      paint();
      return;
    }
    Object.assign(a, { tc: c, tw: w, ts: s, spring });
    if (!a.raf) { a.last = 0; a.raf = requestAnimationFrame(tick); }
  }, [paint, tick]);

  const snapTo = useCallback((r) => {
    const a = anim.current;
    cancelAnimationFrame(a.raf);
    Object.assign(a, { c: r.c, w: r.w, s: 1, tc: r.c, tw: r.w, ts: 1, vc: 0, vw: 0, vs: 0, raf: 0, last: 0 });
    lift(false);
    paint();
  }, [paint]);

  // Place the lens vertically and the copies inside it exactly over the real items
  const layout = useCallback(() => {
    const lens = lensRef.current;
    let top = null;
    for (const key of keysKey.split('|')) {
      const r = rectOf(key), g = ghosts.current[key];
      if (!r) continue;
      if (top === null && lens) {
        top = r.y;
        lens.style.top = `${r.y}px`;
        lens.style.height = `${r.h}px`;
      }
      if (g) Object.assign(g.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
    }
  }, [keysKey, rectOf]);

  // Follow the selected item
  useLayoutEffect(() => {
    const a = anim.current, bar = barRef.current;
    if (!enabled) { a.ready = false; return undefined; }
    if (!bar) return undefined;
    const r = active != null ? rectOf(active) : null;
    bar.classList.toggle('lens-off', !r);   // nothing selected: the lens fades away
    if (!r) { a.ready = false; return undefined; }
    layout();
    if (!a.ready) { a.ready = true; snapTo(r); return undefined; }  // first show / theme switch
    if (drag.current?.moved) return undefined;
    if (fromDrag.current) { fromDrag.current = false; return undefined; }  // the release already aimed here
    if (reduced()) { snapTo(r); return undefined; }
    // A tap: the glass lifts while it travels, then lands
    lift(true);
    animateTo(r.c, r.w, LIFT * 0.92, SPRING.settle);
    const id = setTimeout(() => animateTo(r.c, r.w, 1, SPRING.settle), 160);
    return () => clearTimeout(id);
  }, [active, enabled, rectOf, layout, animateTo, snapTo]);

  // Re-measure when the bar actually changes size (fonts, rotation, window resize).
  // Set up once per mount; the observer's initial callback is ignored, so it can't
  // cut a running animation short.
  useEffect(() => {
    const bar = barRef.current;
    if (!enabled || !bar) return undefined;
    const resync = () => {
      layout();
      if (drag.current) return;
      const r = activeRef.current != null ? rectOf(activeRef.current) : null;
      if (r) snapTo(r);
    };
    let size = `${bar.offsetWidth}x${bar.offsetHeight}`;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
      const next = `${bar.offsetWidth}x${bar.offsetHeight}`;
      if (next !== size) { size = next; resync(); }
    }) : null;
    ro?.observe(bar);
    let live = true;
    document.fonts?.ready.then(() => { if (live && !anim.current.raf) resync(); });
    return () => { live = false; ro?.disconnect(); };
  }, [enabled, rectOf, layout, snapTo]);

  useEffect(() => () => cancelAnimationFrame(anim.current.raf), []);

  const nearest = (centre) => {
    let best = null;
    for (const key of keys) {
      const r = rectOf(key);
      if (r && (!best || Math.abs(r.c - centre) < Math.abs(best.r.c - centre))) best = { key, r };
    }
    return best;
  };

  const cancel = () => {
    drag.current = null;
    barRef.current?.classList.remove('is-dragging');
    const r = activeRef.current != null ? rectOf(activeRef.current) : null;
    if (r) animateTo(r.c, r.w, 1, SPRING.settle);
  };

  const onPointerDown = (e) => {
    if (!enabled || active == null || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const a = anim.current, bar = barRef.current;
    const barX = bar.getBoundingClientRect().left + bar.clientLeft;
    const px = e.clientX - barX;
    const onLens = Math.abs(px - a.c) <= a.w / 2;
    drag.current = {
      id: e.pointerId, startX: e.clientX, startY: e.clientY, barX, moved: false,
      grab: onLens ? px - a.c : 0, samples: [{ t: e.timeStamp, x: e.clientX }],
    };
    // Touching the selected item lifts the glass straight away, as in iOS
    if (onLens && !reduced()) { lift(true); animateTo(a.tc, a.tw, LIFT, SPRING.settle); }
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) {
      const dx = Math.abs(e.clientX - d.startX), dy = Math.abs(e.clientY - d.startY);
      if (dx < 6) { if (dy > 10) cancel(); return; }
      d.moved = true;
      // Touch pointers are implicitly captured by the item under the finger; move the
      // capture to the bar so the drag keeps coming here wherever the finger goes.
      try { barRef.current.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
      barRef.current.classList.add('is-dragging');
      lift(true);
    }
    d.samples.push({ t: e.timeStamp, x: e.clientX });
    while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift();

    const first = rectOf(keys[0]), last = rectOf(keys[keys.length - 1]);
    let centre = e.clientX - d.barX - d.grab;
    const hit = nearest(centre);
    // Past either end, resist like a scroll view
    if (centre < first.c) centre = first.c + rubberBand(centre - first.c, RUBBER_BAND);
    else if (centre > last.c) centre = last.c + rubberBand(centre - last.c, RUBBER_BAND);
    animateTo(centre, hit.r.w, LIFT, SPRING.track);
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) { cancel(); return; }          // a tap: the item's own click handler selects it
    drag.current = null;
    barRef.current.classList.remove('is-dragging');

    // Release velocity over the last ~100 ms (zero if the finger had come to rest),
    // projected to where a flick would carry it
    d.samples.push({ t: e.timeStamp, x: e.clientX });
    const recent = d.samples.filter((p) => e.timeStamp - p.t <= 100);
    const s0 = recent[0], s1 = recent[recent.length - 1];
    const v = recent.length > 1 && s1.t > s0.t ? ((s1.x - s0.x) / (s1.t - s0.t)) * 1000 : 0;
    const target = nearest(e.clientX - d.barX - d.grab + project(v));
    animateTo(target.r.c, target.r.w, 1, SPRING.settle);
    if (target.key !== activeRef.current) { fromDrag.current = true; onSelect(target.key); }

    // The release may also fire a click on the item under the pointer; swallow it
    const block = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
    window.addEventListener('click', block, { capture: true, once: true });
    setTimeout(() => window.removeEventListener('click', block, { capture: true }), 80);
  };

  const barProps = {
    ref: barRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: (e) => { if (drag.current?.id === e.pointerId) cancel(); },
    // Only the bar losing capture ends a drag. (When the drag starts, the item that
    // held the touch's implicit capture loses it too; that bubbles here and must not.)
    onLostPointerCapture: (e) => {
      if (e.target === barRef.current && drag.current?.moved && drag.current.id === e.pointerId) cancel();
    },
    onDragStart: (e) => e.preventDefault(),     // links: no native drag ghost
  };

  return {
    barProps,
    lensRef,
    contentRef,
    itemRef: (key) => (el) => { items.current[key] = el; },
    ghostRef: (key) => (el) => { ghosts.current[key] = el; },
  };
}
