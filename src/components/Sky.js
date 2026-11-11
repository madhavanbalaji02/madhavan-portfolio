import { useEffect, useRef } from 'react';

// Light-mode backdrop: a fixed sky that moves from afternoon to sunset as you scroll.
// Scroll progress (0 at the top, 1 at the bottom) is written to --p on <html>;
// the CSS crossfades the sky layers and drifts the clouds from it. Hidden in dark mode.
export default function Sky() {
  const skyRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let selectionStep = -1;
    const update = () => {
      frame = 0;
      // clientHeight is the stable layout viewport; innerHeight changes on phones as the
      // browser's toolbar shows and hides mid-scroll, which would make the sky jump.
      const max = root.scrollHeight - root.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      // Only the sky subtree restyles each frame (setting it on <html> would restyle the
      // whole page on every scroll frame, which stutters on phones)
      skyRef.current?.style.setProperty('--p', p.toFixed(4));
      // Text selection follows the sky too, but in coarse steps so it rarely restyles
      const step = Math.round(p * 10);
      if (step !== selectionStep) { selectionStep = step; root.style.setProperty('--p', (step / 10).toFixed(1)); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Page height changes on route changes and as lazy content loads
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(document.body);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="sky" ref={skyRef} aria-hidden="true">
      <div className="sky-layer sky-afternoon" />
      <div className="sky-layer sky-golden" />
      <div className="sky-layer sky-sunset" />
      <div className="sky-clouds sky-clouds-day" />
      <div className="sky-clouds sky-clouds-dusk" />
    </div>
  );
}
