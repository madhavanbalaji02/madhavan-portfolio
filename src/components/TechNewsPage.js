/**
 * TechNewsPage — Daily Tech Intel (standalone page at /#/tech-news)
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
import './TechNewsPage.css';

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

const BADGE_CLASS = {
  AI:       'tnp-cat-ai',
  Security: 'tnp-cat-security',
  Gadgets:  'tnp-cat-gadgets',
  Software: 'tnp-cat-software',
  Science:  'tnp-cat-science',
};

const TABS = [
  { key: 'forYou',         label: 'For You',          icon: 'fa-solid fa-star',        sub: 'AI · Agents · LLMs · Industry', accent: '#a78bfa' },
  { key: 'myStack',        label: 'My Stack',          icon: 'fa-solid fa-flask',       sub: 'MLOps · Alignment · Vision · Recsys', accent: '#4ade80' },
  { key: 'aroundTheWorld', label: 'Around the World',  icon: 'fa-solid fa-globe',       sub: 'Global · 🇯🇵 🇩🇪 Translated', accent: '#60a5fa' },
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
        setAnalysis(data);
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

        {/* Hero — mirrors pd-hero */}
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

          {/* Quick summary — always shown */}
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

        {/* Read original CTA — matches btn-primary in portfolio */}
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
        <time className="tnp-date">{timeAgo(article.pubDate)}</time>
      </footer>

      <div className="tnp-ai-label">
        <i className="fa-solid fa-wand-magic-sparkles" />
        AI Summary · Click for deep analysis
      </div>
    </article>
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

  useEffect(() => {
    document.title = 'Daily Tech Intel | Madhavan Balaji';
    return () => { document.title = 'Madhavan Balaji'; };
  }, []);

  const fetchNews = useCallback(async (force = false) => {
    const url = force ? `${API_BASE}/api/tech-news?refresh=1` : `${API_BASE}/api/tech-news`;
    try {
      const res  = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const s = data.sections ?? EMPTY_SECTIONS;
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
  const accent        = activeTabMeta?.accent ?? '#a78bfa';
  const articles      = sections[activeTab] ?? [];

  const cacheLabel = meta
    ? meta.stale ? 'stale cache' : meta.fromCache ? 'cached · refreshes daily' : 'just fetched'
    : null;

  const skeletonCount = 12;

  return (
    <div className="tnp-root">

      {/* ── Top bar ── */}
      <header className="tnp-topbar">
        <a href="/#/" className="tnp-back">
          <i className="fa-solid fa-arrow-left" /> Portfolio
        </a>
        <button className="tnp-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          <i className={theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} />
        </button>
        <div className="tnp-brand">
          <span className="tnp-brand-dot" style={{ background: accent }} />
          Daily Tech Intel
          {meta?.stale && <span className="tnp-stale">stale</span>}
        </div>
      </header>

      {/* ── Tab bar ── */}
      <nav className="tnp-tabbar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tnp-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? { '--tab-accent': tab.accent } : {}}
          >
            <i className={tab.icon} />
            <span className="tnp-tab-label">{tab.label}</span>
            <span className="tnp-tab-sub">{tab.sub}</span>
          </button>
        ))}
      </nav>

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
            <button className="tnp-refresh-btn" onClick={handleRefresh}>
              <i className="fa-solid fa-rotate-right" /> Try Again
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="tnp-empty">
            <i className="fa-solid fa-newspaper tnp-empty-icon" />
            <div className="tnp-empty-title">No articles in this section</div>
            <button className="tnp-refresh-btn" onClick={handleRefresh}>
              <i className="fa-solid fa-rotate-right" /> Refresh
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
