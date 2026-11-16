import { useEffect } from 'react';
import haptic from './haptics';

// A small thing to play with: drag it and it gives a little (rubber-banded, tilting
// with the pull), let go and it springs home with SwiftUI's bouncy spring. Works with a
// mouse, a finger or a pen. A drag never counts as a click.
export default function useFidget(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const LIMIT = 34;
    const band = (v) => (1 - 1 / ((Math.abs(v) * 0.55) / LIMIT + 1)) * LIMIT * Math.sign(v);
    const k = (2 * Math.PI / 0.45) ** 2, c = (4 * Math.PI * 0.5) / 0.45;   // response .45, ζ .5
    let d = null, moved = false, raf = 0, x = 0, y = 0, vx = 0, vy = 0, last = 0;

    const apply = () => { el.style.transform = x || y ? `translate3d(${x}px,${y}px,0) rotate(${(x * 0.5).toFixed(2)}deg)` : ''; };
    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      vx += (-k * x - c * vx) * dt; x += vx * dt;
      vy += (-k * y - c * vy) * dt; y += vy * dt;
      if (Math.abs(x) + Math.abs(y) < 0.05 && Math.abs(vx) + Math.abs(vy) < 0.5) { x = y = vx = vy = 0; apply(); raf = 0; return; }
      apply();
      raf = requestAnimationFrame(step);
    };
    const down = (e) => {
      if (e.button > 0 || !e.isPrimary) return;
      d = { id: e.pointerId, x0: e.clientX - x, y0: e.clientY - y };
      moved = false;
      cancelAnimationFrame(raf); raf = 0;
    };
    const move = (e) => {
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
      if (!moved) {
        if (Math.hypot(dx, dy) < 4) return;
        moved = true;
        try { el.setPointerCapture(e.pointerId); } catch { /* gone */ }
        el.classList.add('is-fidgeting');
      }
      x = band(dx); y = band(dy); vx = vy = 0;
      apply();
    };
    const up = (e) => {
      if (!d || e.pointerId !== d.id) return;
      d = null;
      el.classList.remove('is-fidgeting');
      if (!moved) return;
      if (e.pointerType !== 'mouse') haptic();
      if (reduced) { x = y = 0; apply(); return; }
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const click = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    const noDrag = (e) => e.preventDefault();

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    el.addEventListener('dragstart', noDrag);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true);
      el.removeEventListener('dragstart', noDrag);
    };
  }, [ref]);
}
