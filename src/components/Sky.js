import { useEffect } from 'react';

// Light-mode backdrop: a fixed sky that moves from afternoon to sunset as you scroll.
// Scroll progress (0 at the top, 1 at the bottom) is written to --p on <html>;
// the CSS crossfades the sky layers and drifts the clouds from it. Hidden in dark mode.
export default function Sky() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--p', max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : '0');
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
    <div className="sky" aria-hidden="true">
      <div className="sky-layer sky-afternoon" />
      <div className="sky-layer sky-golden" />
      <div className="sky-layer sky-sunset" />
      <div className="sky-clouds sky-clouds-day" />
      <div className="sky-clouds sky-clouds-dusk" />
    </div>
  );
}
