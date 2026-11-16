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
