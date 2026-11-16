import { flushSync } from 'react-dom';
import scrollToSection from './scrollToSection';

// Spatial consistency between the project grid and a project page: the card you open
// grows into the page's header and its title into the heading, and "All Projects"
// shrinks the page back into that same card. Uses the View Transitions API; where it
// is missing (or the visitor prefers reduced motion) navigation is instant as before.

let lastSlug = null;

const canMorph = () =>
  typeof document !== 'undefined' &&
  typeof document.startViewTransition === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The page uses smooth scrolling; jumps inside a transition must be instant so the
// snapshot is taken at the final position
const jump = (top) => window.scrollTo({ top, left: 0, behavior: 'instant' });

const name = (el, value) => { if (el) el.style.viewTransitionName = value; };

// Content that reveals on scroll (Delight.js) must already be visible in the new
// snapshot, or the morph would land on an invisible card
function revealVisibleNow() {
  const shown = [];
  document.querySelectorAll('.fade-in-up:not(.in-view)').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) {
      el.style.transition = 'none';
      el.classList.add('in-view');
      shown.push(el);
    }
  });
  return () => shown.forEach((el) => { el.style.transition = ''; });
}

export async function openProject(navigate, slug, cardEl) {
  const to = `/project/${slug}/`;
  lastSlug = slug;
  if (!canMorph() || !cardEl) { navigate(to); return; }
  // The project page is code-split; load it first so the morph never shows a spinner
  try { await import('./components/ProjectDetail'); } catch { /* navigate anyway */ }
  const title = cardEl.querySelector('.proj-title');
  name(cardEl, 'project-card');
  name(title, 'project-title');
  document.startViewTransition(() => {
    flushSync(() => navigate(to));
    jump(0);
  });
}

export function backToProjects(navigate) {
  if (!canMorph()) {
    navigate('/');
    setTimeout(() => scrollToSection('#projects'), 150);
    return;
  }
  let card = null;
  let restore = () => {};
  const t = document.startViewTransition(() => {
    flushSync(() => navigate('/'));
    card = lastSlug ? document.querySelector(`.proj-card[data-slug="${lastSlug}"]:not(.is-collapsed)`) : null;
    if (card) {
      // Land with the card in the middle of the screen
      const r = card.getBoundingClientRect();
      jump(Math.max(0, window.scrollY + r.top - (window.innerHeight - r.height) / 2));
      name(card, 'project-card');
      name(card.querySelector('.proj-title'), 'project-title');
    } else {
      const projects = document.querySelector('#projects');
      if (projects) jump(projects.getBoundingClientRect().top + window.scrollY - 80);
    }
    restore = revealVisibleNow();
  });
  t.finished.finally(() => {
    restore();
    if (card) { name(card, ''); name(card.querySelector('.proj-title'), ''); }
  });
}

// Next / previous project. The page's own content slides out in the direction of
// travel and the next project slides in from the other side, animated directly on the
// element (Web Animations), not through View Transitions: Safari on iPhone can leave a
// stale image of the old title on screen after a view transition, and this path has no
// snapshots at all. `dir` is 'next' or 'prev'. Works in every modern browser.
let moving = false;
export async function goToProject(navigate, slug, dir, prepare) {
  const to = `/project/${slug}/`;
  lastSlug = slug;
  const el = document.querySelector('.pd-container');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!el || reducedMotion || typeof el.animate !== 'function') {
    prepare?.();
    navigate(to);
    jump(0);
    return;
  }
  if (moving) return;
  moving = true;
  const sign = dir === 'next' ? -1 : 1;
  const cs = getComputedStyle(el);
  try {
    // Continue from wherever a swipe left the content
    const out = el.animate(
      [{ transform: cs.transform === 'none' ? 'translate3d(0,0,0)' : cs.transform, opacity: cs.opacity },
       { transform: `translate3d(${sign * 36}%,0,0)`, opacity: 0 }],
      { duration: 170, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' },
    );
    await out.finished.catch(() => {});
    prepare?.();
    flushSync(() => navigate(to));
    jump(0);
    const inn = el.animate(
      [{ transform: `translate3d(${-sign * 36}%,0,0)`, opacity: 0 },
       { transform: 'translate3d(0,0,0)', opacity: 1 }],
      { duration: 400, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'backwards' },
    );
    out.cancel();
    await inn.finished.catch(() => {});
  } finally {
    moving = false;
  }
}
