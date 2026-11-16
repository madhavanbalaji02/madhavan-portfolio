import { useEffect } from 'react';

// Swipe down to close a full-screen sheet, as every iOS sheet does. The content follows
// the finger (or mouse), resists upward pulls, and closes on a long enough drag or a
// downward flick; anything less springs back. Only starts when the sheet is scrolled to
// the top, so scrolling a long sheet still works.
export default function useSheetDrag({ open, sheetRef, innerRef, onClose }) {
  useEffect(() => {
    const sheet = sheetRef.current, inner = innerRef.current;
    if (!open || !sheet || !inner) return undefined;
    let s = null;
    const ease = 'cubic-bezier(.32,.72,0,1)';

    const set = (y) => {
      inner.style.transition = 'none';
      inner.style.transform = `translate3d(0,${y}px,0)`;
      sheet.style.opacity = String(1 - Math.min(0.55, Math.max(0, y) / 700));
    };
    const settle = () => {
      inner.style.transition = `transform .42s ${ease}`;
      inner.style.transform = '';
      sheet.style.opacity = '';
    };
    const begin = (x, y, t) => { s = { x0: x, y0: y, drag: false, samples: [{ t, y }] }; };
    const move = (x, y, t, e) => {
      if (!s) return;
      const dx = x - s.x0, dy = y - s.y0;
      if (!s.drag) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (dy > 0 && Math.abs(dy) > Math.abs(dx) && sheet.scrollTop <= 0) s.drag = true;
        else { s = null; return; }
      }
      if (e.cancelable) e.preventDefault();
      s.samples.push({ t, y });
      while (s.samples.length > 2 && t - s.samples[0].t > 100) s.samples.shift();
      set(dy > 0 ? dy : dy * 0.2);
    };
    const end = (y) => {
      if (!s) return;
      const { drag, y0, samples } = s;
      s = null;
      if (!drag) return;
      const a = samples[0], b = samples[samples.length - 1];
      const v = b.t > a.t ? (b.y - a.y) / (b.t - a.t) : 0;
      const dy = y - y0;
      // the drag must not also tap the link it started on
      const block = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
      window.addEventListener('click', block, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', block, { capture: true }), 80);
      if (dy > 110 || (v > 0.5 && dy > 30)) {
        inner.style.transition = `transform .3s ${ease}`;
        inner.style.transform = `translate3d(0,${Math.round(window.innerHeight * 0.4)}px,0)`;
        sheet.style.opacity = '';
        onClose();
        setTimeout(() => { inner.style.transition = ''; inner.style.transform = ''; }, 340);
      } else {
        settle();
      }
    };

    const ts = (e) => { const p = e.touches[0]; begin(p.clientX, p.clientY, e.timeStamp); };
    const tm = (e) => { const p = e.touches[0]; move(p.clientX, p.clientY, e.timeStamp, e); };
    const te = (e) => { const p = e.changedTouches[0]; end(p.clientY); };
    const tc = () => { if (s?.drag) settle(); s = null; };
    const pd = (e) => { if (e.pointerType === 'mouse' && e.button === 0) begin(e.clientX, e.clientY, e.timeStamp); };
    const pm = (e) => { if (e.pointerType === 'mouse' && s) move(e.clientX, e.clientY, e.timeStamp, e); };
    const pu = (e) => { if (e.pointerType === 'mouse') end(e.clientY); };

    sheet.addEventListener('touchstart', ts, { passive: true });
    sheet.addEventListener('touchmove', tm, { passive: false });
    sheet.addEventListener('touchend', te);
    sheet.addEventListener('touchcancel', tc);
    sheet.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    return () => {
      sheet.removeEventListener('touchstart', ts);
      sheet.removeEventListener('touchmove', tm);
      sheet.removeEventListener('touchend', te);
      sheet.removeEventListener('touchcancel', tc);
      sheet.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
    };
  }, [open, sheetRef, innerRef, onClose]);
}
