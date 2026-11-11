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
// In light mode the selection is a Liquid Glass "lens", modelled on the iOS 26 tab bar.
// Press anywhere on the bar and slide: the lens lifts, turns to clear glass, follows the
// finger on a spring, stretches with speed and magnifies the tab beneath it; release and
// it springs onto that tab. Taps slide it across with the same physics.
// The animation runs on requestAnimationFrame and writes styles directly, so dragging
// never re-renders React. The lens holds a copy of the tabs in their selected style,
// which it scales with itself, giving the magnified, tinted look through the glass.

const LIFT = 1.2;
const SPRINGS = {
  follow: { k: 1500, c: 70 },   // tracks the finger: fast, barely any lag
  settle: { k: 420,  c: 26 },   // snaps onto a tab with a small overshoot
  scale:  { k: 520,  c: 22 },   // lift and land, a little jelly
};

function TabBar({ tabs, active, onChange, draggable }) {
  const barRef     = useRef(null);
  const lensRef    = useRef(null);
  const contentRef = useRef(null);
  const tabRefs    = useRef({});
  const ghostRefs  = useRef({});
  const drag       = useRef(null);
  const fromDrag   = useRef(false);
  const anim = useRef({
    x: 0, w: 0, s: 1, vx: 0, vw: 0, vs: 0, tx: 0, tw: 0, ts: 1,
    spring: SPRINGS.settle, raf: 0, last: 0, ready: false,
  });

  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const rectOf = useCallback((key) => {
    const el = tabRefs.current[key];
    return el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null;
  }, []);

  const paint = useCallback(() => {
    const a = anim.current, lens = lensRef.current, content = contentRef.current;
    if (!lens || !content) return;
    // Speed stretches the glass along the direction of travel and thins it a touch
    const stretch = Math.min(0.22, Math.abs(a.vx) / 2600);
    const sx = a.s * (1 + stretch), sy = a.s * (1 - stretch * 0.45);
    lens.style.width = `${a.w}px`;
    lens.style.transform = `translate3d(${a.x}px,0,0) scale(${sx},${sy})`;
    content.style.transform = `translate3d(${-a.x}px,${-lens.offsetTop}px,0)`;
  }, []);

  const tick = useCallback((t) => {
    const a = anim.current;
    const dt = Math.min(1 / 30, a.last ? (t - a.last) / 1000 : 1 / 60);
    a.last = t;
    const steps = 4, h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const { k, c } = a.spring;
      a.vx += (-k * (a.x - a.tx) - c * a.vx) * h; a.x += a.vx * h;
      a.vw += (-k * (a.w - a.tw) - c * a.vw) * h; a.w += a.vw * h;
      const S = SPRINGS.scale;
      a.vs += (-S.k * (a.s - a.ts) - S.c * a.vs) * h; a.s += a.vs * h;
    }
    const still = Math.abs(a.x - a.tx) < 0.05 && Math.abs(a.vx) < 0.5
      && Math.abs(a.w - a.tw) < 0.05 && Math.abs(a.vw) < 0.5
      && Math.abs(a.s - a.ts) < 0.001 && Math.abs(a.vs) < 0.01;
    if (still) {
      Object.assign(a, { x: a.tx, w: a.tw, s: a.ts, vx: 0, vw: 0, vs: 0, raf: 0, last: 0 });
      if (!drag.current?.moved) barRef.current?.classList.remove('is-lifted');
    } else {
      a.raf = requestAnimationFrame(tick);
    }
    paint();
  }, [paint]);

  const animateTo = useCallback((x, w, s, spring) => {
    const a = anim.current;
    Object.assign(a, { tx: x, tw: w, ts: reduced() ? 1 : s, spring });
    if (reduced()) { Object.assign(a, { x, w, s: 1, vx: 0, vw: 0, vs: 0 }); paint(); return; }
    if (!a.raf) { a.last = 0; a.raf = requestAnimationFrame(tick); }
  }, [paint, tick]);

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
    if (!draggable) return;
    const a = anim.current, r = rectOf(active);
    if (!r) return;
    layoutGhosts();
    if (!a.ready) {
      Object.assign(a, { x: r.x, w: r.w, tx: r.x, tw: r.w, ready: true });
      paint();
      return;
    }
    if (drag.current?.moved) return;
    if (fromDrag.current) { fromDrag.current = false; animateTo(r.x, r.w, 1, SPRINGS.settle); return; }
    // A tap: lift briefly while it travels, like iOS
    barRef.current?.classList.add('is-lifted');
    animateTo(r.x, r.w, 1.12, SPRINGS.settle);
    const id = setTimeout(() => animateTo(r.x, r.w, 1, SPRINGS.settle), 170);
    return () => clearTimeout(id);
  }, [active, draggable, rectOf, layoutGhosts, animateTo, paint]);

  // Keep it in place when the bar resizes (fonts loading, rotation)
  useEffect(() => {
    if (!draggable || typeof ResizeObserver === 'undefined' || !barRef.current) return undefined;
    const ro = new ResizeObserver(() => {
      if (drag.current?.moved) return;
      const r = rectOf(active);
      if (!r) return;
      layoutGhosts();
      const a = anim.current;
      Object.assign(a, { x: r.x, w: r.w, tx: r.x, tw: r.w, vx: 0, vw: 0 });
      paint();
    });
    ro.observe(barRef.current);
    return () => ro.disconnect();
  }, [active, draggable, rectOf, layoutGhosts, paint]);

  useEffect(() => () => cancelAnimationFrame(anim.current.raf), []);

  const nearestTab = (centre) => {
    let best = active, bestD = Infinity;
    for (const t of tabs) {
      const r = rectOf(t.key);
      if (!r) continue;
      const d = Math.abs(r.x + r.w / 2 - centre);
      if (d < bestD) { bestD = d; best = t.key; }
    }
    return best;
  };

  const onPointerDown = (e) => {
    if (!draggable || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const barX = barRef.current.getBoundingClientRect().left;
    drag.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY, barX, moved: false, key: active };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const a = anim.current;
    if (!d.moved) {
      const dx = Math.abs(e.clientX - d.startX), dy = Math.abs(e.clientY - d.startY);
      if (dx < 5) { if (dy > 8) drag.current = null; return; }
      d.moved = true;
      // Picked up on the lens: keep the grab point. Elsewhere: the lens jumps to the finger.
      const px = d.startX - d.barX;
      d.grab = px >= a.x && px <= a.x + a.w ? px - (a.x + a.w / 2) : 0;
      barRef.current.setPointerCapture?.(e.pointerId);
      barRef.current.classList.add('is-lifted', 'is-dragging');
    }
    const centre = e.clientX - d.barX - d.grab;
    d.key = nearestTab(centre);
    const w = rectOf(d.key)?.w ?? a.w;
    const max = barRef.current.clientWidth - w - 2;
    animateTo(Math.min(max, Math.max(2, centre - w / 2)), w, LIFT, SPRINGS.follow);
  };

  const endDrag = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) return;
    barRef.current.classList.remove('is-dragging');
    const r = rectOf(d.key);
    if (d.key !== active) { fromDrag.current = true; onChange(d.key); }
    if (r) animateTo(r.x, r.w, 1, SPRINGS.settle);
    // The release also fires a click on the tab under the pointer; swallow it
    const block = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
    window.addEventListener('click', block, { capture: true, once: true });
    setTimeout(() => window.removeEventListener('click', block, { capture: true }), 50);
  };

  return (
    <nav
      ref={barRef}
      className="tnp-tabbar"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
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
