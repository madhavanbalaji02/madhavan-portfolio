// Scroll so a section's content (not its top padding) sits just below the floating
// navbar, at every screen size. Used by the navbar, footer, hero and project pages.
//
// Sections have generous top padding (up to 150px), so aiming at the section box
// itself leaves a large empty band under the navbar. Measured from the section box
// plus its padding, so fade-in transforms on the content can't skew the target.
const GAP = 24;   // breathing room between the navbar and the section heading

export function sectionScrollTop(target) {
  if (!target || target === '#home' || target === 'home') return 0;
  const sel = typeof target === 'string' ? (target.startsWith('#') ? target : `#${target}`) : null;
  const el = sel ? document.querySelector(sel) : target;
  if (!el) return null;
  const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const nav = document.querySelector('.navbar, .pd-nav');
  const navBottom = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
  const contentTop = el.getBoundingClientRect().top + window.scrollY + padTop;
  return Math.max(0, Math.round(contentTop - navBottom - GAP));
}

// Content above the target can still be settling (images, lazy sections, a page
// that just navigated home), which moves the section mid-scroll. So once the scroll
// comes to rest, re-measure and glide the rest of the way, up to twice. Any scroll
// input from the visitor cancels the correction.
let pending = null;

export default function scrollToSection(target, behavior = 'smooth') {
  const top = sectionScrollTop(target);
  if (top == null) return;
  if (pending) pending();
  window.scrollTo({ top, behavior });

  let tries = 0, timer = 0, lastY = -1, idle = 0, done = false;
  const userInput = () => stop();
  const stop = () => {
    done = true;
    clearTimeout(timer);
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((t) => window.removeEventListener(t, userInput));
    pending = null;
  };
  const check = () => {
    if (done) return;
    const y = window.scrollY;
    idle = Math.abs(y - lastY) < 1 ? idle + 1 : 0;   // at rest for ~3 checks (≈150 ms)
    lastY = y;
    if (idle < 3) { timer = setTimeout(check, 50); return; }
    const goal = sectionScrollTop(target);
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    if (goal != null && Math.abs(y - Math.min(goal, maxY)) > 4 && tries < 2) {
      tries += 1; idle = 0;
      window.scrollTo({ top: goal, behavior });
      timer = setTimeout(check, 50);
      return;
    }
    stop();
  };
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((t) => window.addEventListener(t, userInput, { passive: true }));
  pending = stop;
  timer = setTimeout(check, 50);
  setTimeout(stop, 4000);   // never linger
}
