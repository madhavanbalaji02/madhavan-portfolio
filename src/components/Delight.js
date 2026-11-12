import { useEffect } from 'react';

// Small moments of delight, applied site-wide (mounted once in App):
//  1. Scroll reveals: content marked .fade-in-up glides in as it enters the screen,
//     with items that arrive together (e.g. a row of cards) staggered left to right.
//  2. Count-ups: numbers marked .count roll up to their value when first seen.
//  3. Card tilt and sheen: on devices with a mouse or trackpad, project and news
//     cards lean gently toward the cursor and catch a soft highlight.
//  4. Magnetic buttons: primary buttons drift a few pixels toward the cursor.
// Everything respects "Reduce motion": reveals become plain fades, nothing tilts,
// drifts or counts. Without JavaScript (and in the prerendered HTML) all content is
// simply visible.

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const counted = new WeakSet();   // numbers roll up once per page view

function countUp(el) {
  if (counted.has(el)) return;
  counted.add(el);
  const to = parseFloat(el.dataset.to);
  if (!Number.isFinite(to) || reducedMotion()) return;
  const dur = 1100;
  const start = performance.now();
  const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
  const step = (now) => {
    const t = Math.min(1, (now - start) / dur);
    el.textContent = String(Math.round(to * easeOutExpo(t)));
    if (t < 1) requestAnimationFrame(step);
  };
  el.textContent = '0';
  requestAnimationFrame(step);
}

export default function Delight() {
  // 1 + 2. Reveals and count-ups
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.fade-in-up').forEach((el) => el.classList.add('in-view'));
      return undefined;
    }
    const io = new IntersectionObserver((entries) => {
      const arriving = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target)
        .sort((a, b) => {
          const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
          return Math.abs(ra.top - rb.top) > 8 ? ra.top - rb.top : ra.left - rb.left;
        });
      arriving.forEach((el, i) => {
        io.unobserve(el);
        if (el.classList.contains('count')) { countUp(el); return; }
        const delay = Math.min(i, 5) * 70;
        if (delay) {
          el.style.transitionDelay = `${delay}ms`;
          // Clear it afterwards so hover and press transitions stay instant
          setTimeout(() => { el.style.transitionDelay = ''; }, delay + 900);
        }
        el.classList.add('in-view');
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    // What this instance watches is tracked here, not on the elements, so a remount
    // (React development mode, hot reload) starts watching everything afresh.
    const watched = new WeakSet();
    const watch = (root) => {
      root.querySelectorAll?.('.fade-in-up:not(.in-view), .count').forEach((el) => {
        if (watched.has(el) || counted.has(el)) return;
        watched.add(el);
        io.observe(el);
      });
    };
    watch(document);
    // New content (route changes, filters, "Show more") gets the same treatment
    const mo = new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && watch(n.parentNode || n))));
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net: whenever scrolling settles, anything on or above the screen that is
    // somehow still hidden is revealed. Content must never stay invisible.
    let settle = 0;
    const sweep = () => {
      document.querySelectorAll('.fade-in-up:not(.in-view)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.height && r.top < window.innerHeight) { io.unobserve(el); el.classList.add('in-view'); }
      });
    };
    const onScroll = () => { clearTimeout(settle); settle = setTimeout(sweep, 250); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const first = setTimeout(sweep, 1500);

    return () => {
      io.disconnect(); mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(settle); clearTimeout(first);
    };
  }, []);

  // 3. Card tilt and sheen  4. Magnetic buttons
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return undefined;
    document.documentElement.classList.add('can-tilt');
    let frame = 0, lastEvent = null;
    const TILT = '.proj-card, .tnp-card';
    const MAGNET = '.btn-primary, .tnt-cta';

    const apply = () => {
      frame = 0;
      const e = lastEvent;
      if (!e) return;
      const card = e.target.closest?.(TILT);
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
        card.style.setProperty('--ry', `${((x - 0.5) * 5).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((0.5 - y) * 4).toFixed(2)}deg`);
      }
      const btn = e.target.closest?.(MAGNET);
      document.querySelectorAll(`${MAGNET}`).forEach((b) => {
        if (b !== btn && b.style.translate) b.style.translate = '';
      });
      if (btn) {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const pull = (v, max) => Math.max(-max, Math.min(max, v * 0.18));
        btn.style.translate = `${pull(dx, 6).toFixed(1)}px ${pull(dy, 4).toFixed(1)}px`;
      }
    };
    const onMove = (e) => { lastEvent = e; if (!frame) frame = requestAnimationFrame(apply); };
    const onOut = (e) => {
      const card = e.target.closest?.(TILT);
      if (card && !card.contains(e.relatedTarget)) ['--rx', '--ry'].forEach((p) => card.style.removeProperty(p));
      const btn = e.target.closest?.(MAGNET);
      if (btn && !btn.contains(e.relatedTarget)) btn.style.translate = '';
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    return () => {
      document.documentElement.classList.remove('can-tilt');
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
