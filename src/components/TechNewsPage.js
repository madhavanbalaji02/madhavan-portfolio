/**
 * TechNewsPage: Daily Tech Intel (standalone page at /tech-news/)
 *
 * Architecture:
 *   Browser → GET /api/tech-news → Express (port 3001)
 *     → 10 RSS feeds (English + Japanese + German + ArXiv + HuggingFace)
 *     → Claude picks 12 per section × 3 sections (For You / My Stack / Around the World)
 *     → 24-hour NodeCache
 *
 * Article detail: click any card → modal opens instantly with the 2-sentence summary,
 *   then fetches GET /api/tech-news/analyze for a full 5-7 sentence AI analysis +
 *   4 key takeaways (cached per-article for 7 days).
 */

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import './TechNewsPage.css';
import { useSeo } from '../seo';

// ── Helpers ────────────────────────────────────────────────────────────────────

function timeAgo(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// Swap em dashes in AI-written text for commas, recursing through arrays/objects
function stripDashes(value) {
  if (typeof value === 'string') return value.replace(/\s*—\s*/g, ', ');
  if (Array.isArray(value)) return value.map(stripDashes);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, stripDashes(v)]));
  }
  return value;
}

const BADGE_CLASS = {
  AI:       'tnp-cat-ai',
  Security: 'tnp-cat-security',
  Gadgets:  'tnp-cat-gadgets',
  Software: 'tnp-cat-software',
  Science:  'tnp-cat-science',
};

const TABS = [
  { key: 'forYou',         label: 'For You',          icon: 'fa-solid fa-star',        sub: 'AI · Agents · LLMs · Industry', accent: 'var(--gold)' },
  { key: 'myStack',        label: 'My Stack',          icon: 'fa-solid fa-flask',       sub: 'MLOps · Alignment · Vision · Recsys', accent: 'var(--cyan)' },
  { key: 'aroundTheWorld', label: 'Around the World',  icon: 'fa-solid fa-globe',       sub: 'Global · 🇯🇵 🇩🇪 Translated', accent: 'var(--t2)' },
];

const EMPTY_SECTIONS = { forYou: [], myStack: [], aroundTheWorld: [] };
const API_BASE = 'https://madhavan-tech-news.madhavanbalaji02.workers.dev';

// ── Article Detail Modal ───────────────────────────────────────────────────────

function ArticleDetailModal({ article, onClose }) {
  const [analysis,   setAnalysis]   = useState(null);
  const [loadingAI,  setLoadingAI]  = useState(true);
  const [errorAI,    setErrorAI]    = useState(null);
  const overlayRef = useRef(null);

  // Fetch full analysis on mount
  useEffect(() => {
    const params = new URLSearchParams({
      url:     article.url,
      title:   article.title,
      source:  article.source || '',
      summary: article.summary || '',
    });
    fetch(`${API_BASE}/api/tech-news/analyze?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAnalysis(stripDashes(data));
      })
      .catch((err) => setErrorAI(err.message))
      .finally(() => setLoadingAI(false));
  }, [article]);

  // Close on overlay click or Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  const catClass = BADGE_CLASS[article.category] || 'tnp-cat-ai';

  return (
    <div className="tnp-modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="tnp-modal" role="dialog" aria-modal="true">

        {/* Close */}
        <button className="tnp-modal-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>

        {/* Hero: mirrors pd-hero */}
        <div className="tnp-modal-hero">
          <div className="tnp-modal-meta">
            <span className={`tnp-cat ${catClass}`}>{article.category}</span>
            {article.wasTranslated && (
              <span className="tnp-translated">{article.countryFlag} Translated from {article.originalLanguage}</span>
            )}
            {!article.wasTranslated && article.countryFlag && article.countryFlag !== '🇺🇸' && (
              <span className="tnp-flag">{article.countryFlag}</span>
            )}
          </div>

          <h2 className="tnp-modal-title">{article.title}</h2>

          <div className="tnp-modal-source-row">
            <span>{article.source}</span>
            <span className="tnp-modal-source-dot">·</span>
            <span>{timeAgo(article.pubDate)}</span>
            <span className="tnp-modal-source-dot">·</span>
            <span>✨ Deep Analysis</span>
          </div>
        </div>

        {/* Body */}
        <div className="tnp-modal-body">

          {/* Quick summary: always shown */}
          <div className="tnp-modal-section">
            <div className="tnp-modal-section-title">Overview</div>
            <p className="tnp-modal-full-summary">{article.summary}</p>
          </div>

          {/* Full AI analysis */}
          <div className="tnp-modal-section">
            <div className="tnp-modal-section-title">Deep Analysis</div>
            {loadingAI ? (
              <div className="tnp-modal-loading">
                {[100, 90, 95, 80, 70].map((w, i) => (
                  <div key={i} className="tnp-modal-sk" style={{ width: `${w}%`, height: 15 }} />
                ))}
              </div>
            ) : errorAI ? (
              <p className="tnp-modal-full-summary" style={{ opacity: 0.5 }}>
                Could not generate detailed analysis: {errorAI}
              </p>
            ) : (
              <p className="tnp-modal-full-summary">{analysis?.fullSummary}</p>
            )}
          </div>

          {/* Key points */}
          {!loadingAI && !errorAI && analysis?.keyPoints?.length > 0 && (
            <div className="tnp-modal-section">
              <div className="tnp-modal-section-title">Key Takeaways</div>
              <div className="tnp-modal-points">
                {analysis.keyPoints.map((point, i) => (
                  <div key={i} className="tnp-modal-point">
                    <i className="fa-solid fa-check-circle tnp-modal-point-icon" />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Read original CTA: matches btn-primary in portfolio */}
        <div className="tnp-modal-cta">
          <span className="tnp-modal-cta-note">Touch to go to source article</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tnp-modal-read-btn"
          >
            <i className="fa-solid fa-arrow-up-right-from-square" />
            Read Original Article
          </a>
        </div>

      </div>
    </div>
  );
}

// ── Card skeleton ──────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="tnp-card tnp-skeleton" aria-hidden="true">
      <div className="tnp-card-top">
        <div className="tnp-sk" style={{ width: 54, height: 19 }} />
        <div className="tnp-sk" style={{ width: 70, height: 17 }} />
      </div>
      <div className="tnp-sk" style={{ width: '85%', height: 14 }} />
      <div className="tnp-sk" style={{ width: '60%', height: 14 }} />
      <div className="tnp-sk" style={{ width: '100%', height: 12 }} />
      <div className="tnp-sk" style={{ width: '100%', height: 12 }} />
      <div className="tnp-sk" style={{ width: '70%',  height: 12 }} />
      <div className="tnp-sk" style={{ width: '50%',  height: 12 }} />
      <footer className="tnp-card-footer">
        <div className="tnp-sk" style={{ width: 60, height: 10 }} />
        <div className="tnp-sk" style={{ width: 40, height: 10 }} />
      </footer>
    </div>
  );
}

// ── Article card ───────────────────────────────────────────────────────────────

function ArticleCard({ article, accent, onClick }) {
  const catClass = BADGE_CLASS[article.category] || 'tnp-cat-ai';

  return (
    <article className="tnp-card" style={{ '--card-accent': accent }} onClick={onClick}>
      <div className="tnp-card-top">
        <span className={`tnp-cat ${catClass}`}>{article.category}</span>
        <div className="tnp-card-flags">
          {article.wasTranslated ? (
            <span className="tnp-translated">{article.countryFlag} Translated</span>
          ) : article.countryFlag && article.countryFlag !== '🇺🇸' ? (
            <span className="tnp-flag">{article.countryFlag}</span>
          ) : null}
        </div>
      </div>

      <div className="tnp-title">{article.title}</div>
      <p className="tnp-summary">{article.summary}</p>

      <footer className="tnp-card-footer">
        <span className="tnp-source">{article.source}</span>
        <span className="tnp-footer-sep">·</span>
        <time className="tnp-date">{timeAgo(article.pubDate)}</time>
      </footer>

      <div className="tnp-ai-label">
        <i className="fa-solid fa-wand-magic-sparkles" />
        AI Summary · Click for deep analysis
      </div>
    </article>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────────────────
// In light mode the selection is a Liquid Glass "lens", modelled on the iOS 26 tab bar:
// press the selected tab and it lifts into clear glass that magnifies what is beneath;
// slide (from anywhere on the bar) and it tracks the finger; release or flick and it
// springs onto a tab. Taps slide it across with the same physics.
//
// The motion uses Apple's own published formulas:
//  - Springs are SwiftUI's presets, converted with Apple's response/damping-fraction
//    definition for a unit mass: stiffness = (2π / response)², damping = 4π·ζ / response.
//      tracking → .interactiveSpring()  (response 0.15, ζ 0.86)
//      settling → .snappy               (response 0.5,  bounce 0.15 → ζ 0.85)
//      lift     → .bouncy               (response 0.5,  bounce 0.3  → ζ 0.7)
//  - Flicks choose a tab by projecting the release velocity with UIScrollView's normal
//    deceleration rate (0.998), as in WWDC18 "Designing Fluid Interfaces".
//  - Dragging past either end rubber-bands with UIScrollView's formula
//    (1 − 1 / (x·0.55 / d + 1)) · d, with d = 22 px so it never leaves the bar.
//  - The spring keeps the gesture's velocity on release, so there is no hitch.
// It runs on requestAnimationFrame and writes styles directly; dragging never
// re-renders React. The lens holds a copy of the tabs in their selected style, which
// it scales along with itself, giving the magnified, tinted look through the glass.
// (Apple doesn't publish the tab bar's own tuning; these are its standard curves.)

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
const project = (velocity) => (velocity / 1000) * DECELERATION / (1 - DECELERATION);
const rubberBand = (over, dimension) => (1 - 1 / ((Math.abs(over) * 0.55) / dimension + 1)) * dimension * Math.sign(over);

function TabBar({ tabs, active, onChange, draggable }) {
  const barRef     = useRef(null);
  const lensRef    = useRef(null);
  const contentRef = useRef(null);
  const tabRefs    = useRef({});
  const ghostRefs  = useRef({});
  const drag       = useRef(null);
  const fromDrag   = useRef(false);
  // c = lens centre, w = width, s = scale; v* = velocities, t* = targets
  const anim = useRef(null);
  if (!anim.current) {
    anim.current = { c: 0, w: 0, s: 1, vc: 0, vw: 0, vs: 0, tc: 0, tw: 0, ts: 1, spring: SPRING.settle, raf: 0, last: 0, ready: false };
  }

  const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const lift = (on) => barRef.current?.classList.toggle('is-lifted', on);

  // Sub-pixel tab geometry relative to the bar's padding box
  const rectOf = useCallback((key) => {
    const el = tabRefs.current[key], bar = barRef.current;
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
    content.style.transform = `translate3d(${-x}px,${-lens.offsetTop}px,0)`;
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

  // Place the copies inside the lens exactly over the real tabs
  const layoutGhosts = useCallback(() => {
    for (const t of tabs) {
      const r = rectOf(t.key), g = ghostRefs.current[t.key];
      if (!r || !g) continue;
      Object.assign(g.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
    }
  }, [tabs, rectOf]);

  // Follow the active tab
  useLayoutEffect(() => {
    const a = anim.current;
    if (!draggable) { a.ready = false; return undefined; }
    const r = rectOf(active);
    if (!r) return undefined;
    layoutGhosts();
    if (!a.ready) { a.ready = true; snapTo(r); return undefined; }   // first paint / theme switch: no animation
    if (drag.current?.moved) return undefined;
    if (fromDrag.current) { fromDrag.current = false; return undefined; }  // the release already aimed here
    if (reduced()) { snapTo(r); return undefined; }
    // A tap: the glass lifts while it travels, then lands
    lift(true);
    animateTo(r.c, r.w, LIFT * 0.92, SPRING.settle);
    const id = setTimeout(() => animateTo(r.c, r.w, 1, SPRING.settle), 160);
    return () => clearTimeout(id);
  }, [active, draggable, rectOf, layoutGhosts, animateTo, snapTo]);

  // Re-measure when the bar actually changes size (fonts loading, rotation). Set up once
  // per mount, and the observer's initial callback is ignored, so it can't cut a running
  // animation short.
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const bar = barRef.current;
    if (!draggable || typeof ResizeObserver === 'undefined' || !bar) return undefined;
    let size = `${bar.offsetWidth}x${bar.offsetHeight}`;
    const ro = new ResizeObserver(() => {
      const next = `${bar.offsetWidth}x${bar.offsetHeight}`;
      if (next === size) return;
      size = next;
      layoutGhosts();
      if (drag.current) return;
      const r = rectOf(activeRef.current);
      if (r) snapTo(r);
    });
    ro.observe(bar);
    // Web fonts can change tab widths without changing the bar's size
    let live = true;
    document.fonts?.ready.then(() => {
      if (!live || drag.current) return;
      layoutGhosts();
      const r = rectOf(activeRef.current);
      if (r && !anim.current.raf) snapTo(r);
    });
    return () => { live = false; ro.disconnect(); };
  }, [draggable, rectOf, layoutGhosts, snapTo]);

  useEffect(() => () => cancelAnimationFrame(anim.current.raf), []);

  const nearestTab = (centre) => {
    let best = null;
    for (const t of tabs) {
      const r = rectOf(t.key);
      if (r && (!best || Math.abs(r.c - centre) < Math.abs(best.r.c - centre))) best = { key: t.key, r };
    }
    return best;
  };

  const onPointerDown = (e) => {
    if (!draggable || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const a = anim.current;
    const barX = barRef.current.getBoundingClientRect().left + barRef.current.clientLeft;
    const px = e.clientX - barX;
    const onLens = Math.abs(px - a.c) <= a.w / 2;
    drag.current = {
      id: e.pointerId, startX: e.clientX, startY: e.clientY, barX, moved: false, onLens,
      grab: onLens ? px - a.c : 0, key: active, samples: [{ t: e.timeStamp, x: e.clientX }],
    };
    // Touching the selected tab lifts the glass straight away, as in iOS
    if (onLens && !reduced()) { lift(true); animateTo(a.tc, a.tw, LIFT, SPRING.settle); }
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) {
      const dx = Math.abs(e.clientX - d.startX), dy = Math.abs(e.clientY - d.startY);
      if (dx < 6) { if (dy > 10) cancel(); return; }
      d.moved = true;
      barRef.current.setPointerCapture?.(e.pointerId);
      barRef.current.classList.add('is-dragging');
      lift(true);
    }
    d.samples.push({ t: e.timeStamp, x: e.clientX });
    while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift();

    const first = rectOf(tabs[0].key), last = rectOf(tabs[tabs.length - 1].key);
    let centre = e.clientX - d.barX - d.grab;
    const hit = nearestTab(centre);
    d.key = hit.key;
    // Past either end, resist like a scroll view. The dimension is the most it can
    // ever stretch, kept small so the glass stays on the bar.
    const min = first.c, max = last.c, dim = 22;
    if (centre < min) centre = min + rubberBand(centre - min, dim);
    else if (centre > max) centre = max + rubberBand(centre - max, dim);
    animateTo(centre, hit.r.w, LIFT, SPRING.track);
  };

  const cancel = () => {
    const d = drag.current;
    drag.current = null;
    barRef.current?.classList.remove('is-dragging');
    const r = rectOf(active);
    if (d && r) animateTo(r.c, r.w, 1, SPRING.settle);
  };

  const endDrag = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) { cancel(); return; }          // a tap: the click handler selects the tab
    drag.current = null;
    barRef.current.classList.remove('is-dragging');

    // Release velocity over the last ~100 ms (zero if the finger had come to rest),
    // projected to where a flick would carry it
    d.samples.push({ t: e.timeStamp, x: e.clientX });
    const recent = d.samples.filter((p) => e.timeStamp - p.t <= 100);
    const s0 = recent[0], s1 = recent[recent.length - 1];
    const v = recent.length > 1 && s1.t > s0.t ? ((s1.x - s0.x) / (s1.t - s0.t)) * 1000 : 0;
    const target = nearestTab(e.clientX - d.barX - d.grab + project(v));
    if (target.key !== active) { fromDrag.current = true; onChange(target.key); }
    animateTo(target.r.c, target.r.w, 1, SPRING.settle);

    // The release also fires a click on the tab under the pointer; swallow that one click
    const block = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
    window.addEventListener('click', block, { capture: true, once: true });
    setTimeout(() => window.removeEventListener('click', block, { capture: true }), 80);
  };

  return (
    <nav
      ref={barRef}
      className="tnp-tabbar"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={(e) => { if (drag.current?.id === e.pointerId) cancel(); }}
      onLostPointerCapture={(e) => { if (drag.current?.id === e.pointerId) cancel(); }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          ref={(el) => { tabRefs.current[tab.key] = el; }}
          className={`tnp-tab${active === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
          style={active === tab.key ? { '--tab-accent': tab.accent } : {}}
          aria-pressed={active === tab.key}
        >
          <i className={tab.icon} />
          <span className="tnp-tab-label">{tab.label}</span>
          <span className="tnp-tab-sub">{tab.sub}</span>
        </button>
      ))}
      {draggable && (
        <span className="tnp-tab-lens" ref={lensRef} aria-hidden="true">
          <span className="tnp-tab-lens-content" ref={contentRef}>
            {tabs.map((tab) => (
              <span key={tab.key} ref={(el) => { ghostRefs.current[tab.key] = el; }} className="tnp-tab tnp-tab-ghost">
                <i className={tab.icon} />
                <span className="tnp-tab-label">{tab.label}</span>
              </span>
            ))}
          </span>
        </span>
      )}
    </nav>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function TechNewsPage({ theme, toggleTheme }) {
  const [sections,        setSections]        = useState(EMPTY_SECTIONS);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [meta,            setMeta]            = useState(null);
  const [activeTab,       setActiveTab]       = useState('forYou');
  const [refreshing,      setRefreshing]      = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Aggregated third-party headlines: useful to visitors, but thin/duplicate content
  // for search engines, so keep it out of the index while still following links.
  useSeo({
    title: 'Daily Tech Intel | Madhavan Balaji',
    description: 'A daily AI-curated briefing of global AI research and tech news, built by Madhavan Balaji.',
    path: '/tech-news/',
    noindex: true,
  });

  const fetchNews = useCallback(async (force = false) => {
    const url = force ? `${API_BASE}/api/tech-news?refresh=1` : `${API_BASE}/api/tech-news`;
    try {
      const res  = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const s = stripDashes(data.sections ?? EMPTY_SECTIONS);
      setSections({ forYou: s.forYou ?? [], myStack: s.myStack ?? [], aroundTheWorld: s.aroundTheWorld ?? [] });
      setMeta({ lastUpdated: data.lastUpdated, fromCache: data.fromCache, stale: data.stale });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load tech news.');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchNews().finally(() => setLoading(false));
  }, [fetchNews]);

  async function handleRefresh() {
    setRefreshing(true);
    setError(null);
    await fetchNews(true);
    setRefreshing(false);
  }

  const activeTabMeta = TABS.find((t) => t.key === activeTab);
  const accent        = activeTabMeta?.accent ?? 'var(--gold)';
  const articles      = sections[activeTab] ?? [];

  const cacheLabel = meta
    ? meta.stale ? 'stale cache' : meta.fromCache ? 'cached · refreshes daily' : 'just fetched'
    : null;

  const skeletonCount = 12;

  return (
    <div className="tnp-root">

      {/* ── Top bar ── */}
      <header className="tnp-topbar">
        <a href="/" className="tnp-back">
          <i className="fa-solid fa-arrow-left" /> Portfolio
        </a>
        <div className="tnp-brand">
          <button className="tnp-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <i className={theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun'} />
          </button>
          <span className="tnp-brand-dot" style={{ background: accent }} />
          <h1 className="tnp-brand-title">Daily Tech Intel</h1>
          {meta?.stale && <span className="tnp-stale">stale</span>}
        </div>
      </header>

      {/* ── Tab bar ── */}
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} draggable={theme === 'light'} />

      {/* ── Meta bar ── */}
      {!loading && meta?.lastUpdated && (
        <div className="tnp-metabar">
          <span className="tnp-meta-dot" style={{ background: meta.stale ? 'var(--gold)' : 'var(--green)' }} />
          {cacheLabel}
          <span className="tnp-meta-ai">✨ AI-analyzed</span>
        </div>
      )}

      {/* ── Content ── */}
      <main className="tnp-main">
        {loading ? (
          <div className="tnp-grid">
            {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="tnp-empty">
            <i className="fa-solid fa-triangle-exclamation tnp-empty-icon" />
            <div className="tnp-empty-title">Could not load news</div>
            <p className="tnp-empty-msg">{error}</p>
            <button className="tnp-refresh-btn" onClick={handleRefresh} disabled={refreshing}>
              <i className={`fa-solid fa-rotate-right${refreshing ? ' fa-spin' : ''}`} /> {refreshing ? 'Refreshing…' : 'Try Again'}
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="tnp-empty">
            <i className="fa-solid fa-newspaper tnp-empty-icon" />
            <div className="tnp-empty-title">No articles in this section</div>
            <button className="tnp-refresh-btn" onClick={handleRefresh} disabled={refreshing}>
              <i className={`fa-solid fa-rotate-right${refreshing ? ' fa-spin' : ''}`} /> {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        ) : (
          <div className="tnp-grid">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.url ?? i}
                article={article}
                accent={accent}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Article detail modal ── */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

    </div>
  );
}
