import React, { useEffect, useRef, useState } from 'react';
import haptic from './haptics';

// Moving through projects on a project page, on every kind of device:
//  - Touch (phones, iPads): swipe left or right. The page follows the finger, the next
//    project's title peeks in from the edge, and nothing happens until you let go;
//    reverse to cancel (Rauno Freiberg: preview, then commit on release).
//  - Trackpads: a two-finger horizontal swipe does the same.
//  - Keyboards: ← and →.
//  - Everyone: a floating bar within thumb reach (Fitts's law) with All projects,
//    previous and next.
// Swipes never start at the screen edges (the OS back gesture lives there) or inside
// something that scrolls sideways itself.

const EDGE = 24;          // px kept free at each screen edge for the OS back gesture
const AXIS_LOCK = 10;     // px of movement before deciding horizontal vs vertical

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const threshold = () => Math.min(140, window.innerWidth * 0.28);

// True if `el` sits inside something that scrolls horizontally (in direction `dir`,
// or at all when dir is 0)
function inHorizontalScroller(el, dir = 0) {
  for (let n = el; n && n !== document.body && n.nodeType === 1; n = n.parentElement) {
    const ox = getComputedStyle(n).overflowX;
    if ((ox === 'auto' || ox === 'scroll') && n.scrollWidth > n.clientWidth + 1) {
      if (dir === 0) return true;
      if (dir > 0 ? n.scrollLeft > 0 : n.scrollLeft + n.clientWidth < n.scrollWidth - 1) return true;
    }
  }
  return false;
}

export function useProjectSwipe({ pageRef, contentRef, peekRef, prev, next, go }) {
  const latest = useRef({ prev, next, go });
  latest.current = { prev, next, go };

  useEffect(() => {
    const page = pageRef.current, content = contentRef.current, peek = peekRef.current;
    if (!page || !content || !peek) return undefined;
    const root = document.documentElement;
    root.classList.add('on-project');   // stops trackpad swipes from going back in history

    let crossed = false;
    const show = (dx) => {
      const T = threshold();
      const over = Math.abs(dx) > T;
      // 1:1 with the finger up to the threshold, then resistance
      const eff = over ? Math.sign(dx) * (T + (Math.abs(dx) - T) * 0.35) : dx;
      content.style.transition = 'none';
      content.style.transform = `translate3d(${eff}px,0,0)`;
      content.style.opacity = String(1 - Math.min(0.35, Math.abs(eff) / window.innerWidth));
      const dir = dx < 0 ? 'next' : 'prev';
      const target = latest.current[dir];
      peek.dataset.side = dir;
      peek.querySelector('.pd-peek-k').textContent = dir === 'next' ? 'Next' : 'Previous';
      peek.querySelector('.pd-peek-t').textContent = target.title;
      const p = Math.min(1, Math.abs(dx) / T);
      peek.style.opacity = String(p);
      peek.style.setProperty('--p', p.toFixed(3));
      peek.classList.toggle('is-ready', over);
      if (over !== crossed) { crossed = over; if (over) haptic(); }
    };
    const reset = (animate = true) => {
      crossed = false;
      content.style.transition = animate && !reduced() ? 'transform .38s cubic-bezier(.32,.72,0,1), opacity .3s ease' : 'none';
      content.style.transform = '';
      content.style.opacity = '';
      peek.style.opacity = '0';
      peek.classList.remove('is-ready');
    };
    const commit = (dir) => {
      latest.current.go(dir, () => reset(false));
    };

    // ── Touch and pen ──
    let d = null;
    const onDown = (e) => {
      if (e.pointerType === 'mouse' || !e.isPrimary) return;
      if (e.clientX < EDGE || e.clientX > window.innerWidth - EDGE) return;
      if (inHorizontalScroller(e.target)) return;
      d = { id: e.pointerId, x0: e.clientX, y0: e.clientY, axis: null, samples: [{ t: e.timeStamp, x: e.clientX }] };
    };
    const onMove = (e) => {
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
      if (!d.axis) {
        if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
        d.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
        if (d.axis === 'y') { d = null; return; }
        try { page.setPointerCapture(e.pointerId); } catch { /* gone */ }
      }
      d.samples.push({ t: e.timeStamp, x: e.clientX });
      while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift();
      show(dx);
    };
    const onUp = (e) => {
      if (!d || e.pointerId !== d.id) return;
      const s = d.samples, dx = e.clientX - d.x0;
      const a = s[0], b = s[s.length - 1];
      const v = b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0;   // px per ms
      const wasSwipe = d.axis === 'x';
      d = null;
      if (!wasSwipe) return;
      const flick = Math.abs(v) > 0.45 && Math.abs(dx) > 40 && Math.sign(v) === Math.sign(dx);
      if (Math.abs(dx) > threshold() || flick) commit(dx < 0 ? 'next' : 'prev');
      else reset();
      // a swipe must not also click whatever it started on
      const block = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
      window.addEventListener('click', block, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', block, { capture: true }), 80);
    };
    const onCancel = () => { if (d) { d = null; reset(); } };

    // ── Trackpad: horizontal two-finger swipe ──
    let acc = 0, wheelTimer = 0, lockedUntil = 0;
    const onWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return;
      if (inHorizontalScroller(e.target, e.deltaX > 0 ? -1 : 1)) return;
      e.preventDefault();
      if (e.timeStamp < lockedUntil) return;      // momentum after a committed swipe
      acc -= e.deltaX * (e.deltaMode === 1 ? 16 : 1);
      show(acc);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        const dx = acc; acc = 0;
        if (Math.abs(dx) > threshold()) { lockedUntil = performance.now() + 700; commit(dx < 0 ? 'next' : 'prev'); }
        else reset();
      }, 140);
    };

    // ── Keyboard ──
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); latest.current.go('next'); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); latest.current.go('prev'); }
    };

    page.addEventListener('pointerdown', onDown);
    page.addEventListener('pointermove', onMove);
    page.addEventListener('pointerup', onUp);
    page.addEventListener('pointercancel', onCancel);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      root.classList.remove('on-project');
      page.removeEventListener('pointerdown', onDown);
      page.removeEventListener('pointermove', onMove);
      page.removeEventListener('pointerup', onUp);
      page.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      clearTimeout(wheelTimer);
    };
  }, [pageRef, contentRef, peekRef]);
}

// The label that slides in from the edge while swiping
export const SwipePeek = React.forwardRef((_, ref) => (
  <div className="pd-peek" ref={ref} aria-hidden="true">
    <span className="pd-peek-k">Next</span>
    <span className="pd-peek-t" />
  </div>
));

// Floating bar: All projects · previous · next
export function ProjectBar({ prev, next, go, back }) {
  return (
    <nav className="pd-bar" aria-label="Project navigation">
      <a href="/#projects" className="pd-bar-back" onClick={(e) => { e.preventDefault(); back(); }}>
        <i className="fas fa-grip" aria-hidden="true" />
        <span>All projects</span>
      </a>
      <span className="pd-bar-sep" aria-hidden="true" />
      <button type="button" className="pd-bar-prev" onClick={() => go('prev')} aria-label={`Previous project: ${prev.title}`} title={`${prev.title} (←)`}>
        <i className="fas fa-chevron-left" aria-hidden="true" />
      </button>
      <button type="button" className="pd-bar-next" onClick={() => go('next')} title="Next project (→)">
        <span className="pd-bar-k">Next</span>
        <span className="pd-bar-title">{next.title}</span>
        <i className="fas fa-chevron-right" aria-hidden="true" />
      </button>
    </nav>
  );
}

// Reading guide: a thin progress line, and (on wide screens) a dot per section that
// shows where you are and jumps there (Rauno's "scroll landmarks")
export function ReadingGuide({ sections }) {
  const barRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      let a = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) a = i;
      });
      setActive(a);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector('.pd-nav');
    const offset = (nav ? nav.getBoundingClientRect().bottom : 80) + 20;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: reduced() ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="pd-progress" aria-hidden="true"><span ref={barRef} /></div>
      <nav className="pd-rail" aria-label="On this page">
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`pd-rail-dot${i === active ? ' is-active' : ''}`}
            onClick={() => jumpTo(s.id)}
            aria-current={i === active ? 'location' : undefined}
          >
            <span className="pd-rail-label">{s.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
