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
// In light mode the selected tab sits on a glass "lens" that can be dragged across
// the bar, like the iOS 26 tab bar: press and slide, it lifts and follows the finger,
// and it snaps to the tab you release over. A plain tap still just selects the tab.

function TabBar({ tabs, active, onChange, draggable }) {
  const barRef  = useRef(null);
  const tabRefs = useRef({});
  const drag    = useRef(null);
  const [lens, setLens]       = useState(null);   // { x, w } in px
  const [dragging, setDragging] = useState(false);
  const [hoverKey, setHoverKey] = useState(null);

  const rectOf = useCallback((key) => {
    const el = tabRefs.current[key];
    return el ? { x: el.offsetLeft, w: el.offsetWidth } : null;
  }, []);

  // Keep the lens on the active tab (and in place when the bar resizes)
  useLayoutEffect(() => {
    if (dragging) return undefined;
    const place = () => setLens(rectOf(active));
    place();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(place) : null;
    if (ro && barRef.current) ro.observe(barRef.current);
    return () => ro?.disconnect();
  }, [active, dragging, rectOf]);

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
    if (!draggable || !lens || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const barX = barRef.current.getBoundingClientRect().left;
    const px = e.clientX - barX;
    // Only the selected tab can be picked up, as in iOS
    if (px < lens.x || px > lens.x + lens.w) return;
    drag.current = { id: e.pointerId, startX: e.clientX, grab: px - lens.x, w: lens.w, moved: false, barX };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) {
      if (Math.abs(e.clientX - d.startX) < 6) return;
      d.moved = true;
      barRef.current.setPointerCapture?.(e.pointerId);
      setDragging(true);
    }
    // The lens centre follows the finger; its width morphs to the tab beneath it
    const centre = e.clientX - d.barX - d.grab + d.w / 2;
    const key = nearestTab(centre);
    const w = rectOf(key)?.w ?? d.w;
    const max = barRef.current.clientWidth - w - 2;
    setLens({ x: Math.min(max, Math.max(2, centre - w / 2)), w });
    setHoverKey(key);
  };

  const endDrag = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) return;
    d.suppressClick = true;
    const target = hoverKey || active;
    setDragging(false);
    setHoverKey(null);
    if (target !== active) onChange(target);
    else setLens(rectOf(active));
    // The release fires a click on whatever tab is under the pointer; ignore it
    const block = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
    window.addEventListener('click', block, { capture: true, once: true });
    setTimeout(() => window.removeEventListener('click', block, { capture: true }), 0);
  };

  const shown = dragging ? hoverKey : active;

  return (
    <nav
      ref={barRef}
      className={`tnp-tabbar${dragging ? ' is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {draggable && lens && (
        <span
          className="tnp-tab-lens"
          aria-hidden="true"
          style={{ width: lens.w, transform: `translateX(${lens.x}px)` }}
        />
      )}
      {tabs.map((tab) => (
        <button
          key={tab.key}
          ref={(el) => { tabRefs.current[tab.key] = el; }}
          className={`tnp-tab${active === tab.key ? ' active' : ''}${shown === tab.key ? ' lensed' : ''}`}
          onClick={() => onChange(tab.key)}
          style={active === tab.key ? { '--tab-accent': tab.accent } : {}}
          aria-pressed={active === tab.key}
        >
          <i className={tab.icon} />
          <span className="tnp-tab-label">{tab.label}</span>
          <span className="tnp-tab-sub">{tab.sub}</span>
        </button>
      ))}
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
