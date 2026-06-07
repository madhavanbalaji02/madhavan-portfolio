import React, { useState, useEffect, useCallback } from 'react';
import './TechNews.css';

function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60)    return 'just now';
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const BADGE_CLASS = {
  AI:       'tn-badge-ai',
  Security: 'tn-badge-security',
  Gadgets:  'tn-badge-gadgets',
  Software: 'tn-badge-software',
  Science:  'tn-badge-science',
};

const CATEGORY_ICON = {
  AI:       'fa-solid fa-microchip',
  Security: 'fa-solid fa-shield-halved',
  Gadgets:  'fa-solid fa-mobile-screen',
  Software: 'fa-solid fa-code',
  Science:  'fa-solid fa-flask',
};

const TABS = [
  { key: 'forYou',         label: 'For You',         icon: 'fa-solid fa-star',  accent: '#a78bfa' },
  { key: 'myStack',        label: 'My Stack',         icon: 'fa-solid fa-flask', accent: '#4ade80' },
  { key: 'aroundTheWorld', label: 'Around the World', icon: 'fa-solid fa-globe', accent: '#60a5fa' },
];

const EMPTY_SECTIONS = { forYou: [], myStack: [], aroundTheWorld: [] };
const API_URL = 'https://madhavan-tech-news.madhavanbalaji02.workers.dev/api/tech-news';
const PREVIEW_COUNT = 6;

function SkeletonCard() {
  return (
    <div className="tn-card tn-skeleton" aria-hidden="true">
      <div className="tn-card-top">
        <div className="tn-skeleton-line" style={{ width: 72, height: 20 }} />
        <div className="tn-skeleton-line" style={{ width: 64, height: 14 }} />
      </div>
      <div className="tn-skeleton-line" style={{ width: '90%', height: 15 }} />
      <div className="tn-skeleton-line" style={{ width: '70%', height: 15 }} />
      <div className="tn-skeleton-line" style={{ width: '100%', height: 13, marginTop: 4 }} />
      <div className="tn-skeleton-line" style={{ width: '100%', height: 13 }} />
      <div className="tn-skeleton-line" style={{ width: '80%', height: 13 }} />
      <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <div className="tn-skeleton-line" style={{ width: 80, height: 12 }} />
        <div className="tn-skeleton-line" style={{ width: 52, height: 12 }} />
      </div>
    </div>
  );
}

function NewsCard({ article }) {
  const badgeClass = BADGE_CLASS[article.category] || 'tn-badge-ai';
  const iconClass  = CATEGORY_ICON[article.category] || 'fa-solid fa-newspaper';

  return (
    <article className="tn-card">
      <div className="tn-card-top">
        <span className={`tn-badge ${badgeClass}`}>
          <i className={iconClass} aria-hidden="true" />
          {article.category}
        </span>
        <span className="tn-ai-label">
          {article.wasTranslated ? `${article.countryFlag} Translated` : '✨ AI Summary'}
        </span>
      </div>

      <a
        href={article.url}
        className="tn-title"
        target="_blank"
        rel="noopener noreferrer"
        title={article.title}
      >
        {article.title}
      </a>

      <p className="tn-summary">{article.summary}</p>

      <div className="tn-card-footer">
        <span className="tn-source">{article.source}</span>
        <time className="tn-date" dateTime={article.pubDate}>
          {timeAgo(article.pubDate)}
        </time>
      </div>
    </article>
  );
}

export default function TechNews() {
  const [sections,   setSections]   = useState(EMPTY_SECTIONS);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [meta,       setMeta]       = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab,  setActiveTab]  = useState('forYou');

  const fetchNews = useCallback(async (force = false) => {
    const url = force ? `${API_URL}?refresh=1` : API_URL;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const s = data.sections ?? {};
      setSections({
        forYou:         s.forYou         ?? [],
        myStack:        s.myStack        ?? [],
        aroundTheWorld: s.aroundTheWorld ?? [],
      });
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

  const activeTabMeta  = TABS.find(t => t.key === activeTab);
  const articles       = sections[activeTab] ?? [];
  const displayArticles = articles.slice(0, PREVIEW_COUNT);

  const cacheLabel = meta
    ? meta.stale ? 'stale cache' : meta.fromCache ? 'cached · refreshes daily' : 'just fetched'
    : null;

  return (
    <section id="tech-news" className="section">
      <div className="container">

        <div className="section-header">
          <span className="section-tag">tech news</span>
          <h2 className="section-title">Daily Tech Digest</h2>
          <p className="section-subtitle">
            AI-curated highlights from TechCrunch, The Verge, ArXiv, HuggingFace, and more —
            selected and summarized by Claude.
          </p>
        </div>

        {/* Tab bar */}
        <div className="tn-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`tn-tab${activeTab === tab.key ? ' active' : ''}`}
              style={activeTab === tab.key ? { '--tab-accent': tab.accent } : {}}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={tab.icon} aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        {!loading && (
          <div className="tn-controls">
            <div className="tn-meta">
              <span className={`tn-meta-dot${meta?.stale ? ' stale' : ''}`} />
              {cacheLabel && <span>{cacheLabel}</span>}
              {meta?.lastUpdated && <span>· updated {timeAgo(meta.lastUpdated)}</span>}
            </div>
            <button
              className={`tn-refresh-btn${refreshing ? ' spinning' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh tech news"
            >
              <i className="fa-solid fa-rotate-right" aria-hidden="true" />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="tn-grid">
          {loading ? (
            Array.from({ length: PREVIEW_COUNT }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <div className="tn-error">
              <div className="tn-error-icon"><i className="fa-solid fa-triangle-exclamation" /></div>
              <div className="tn-error-title">Could not load tech news</div>
              <p className="tn-error-msg">{error}</p>
              <button className="tn-refresh-btn" onClick={handleRefresh}>
                <i className="fa-solid fa-rotate-right" aria-hidden="true" />
                Try Again
              </button>
            </div>
          ) : displayArticles.length === 0 ? (
            <div className="tn-error">
              <div className="tn-error-icon"><i className="fa-solid fa-newspaper" /></div>
              <div className="tn-error-title">No articles available</div>
              <button className="tn-refresh-btn" onClick={handleRefresh}>
                <i className="fa-solid fa-rotate-right" aria-hidden="true" />
                Retry
              </button>
            </div>
          ) : (
            displayArticles.map((article, i) => (
              <NewsCard key={article.url ?? i} article={article} />
            ))
          )}
        </div>

        {/* View all link */}
        {!loading && !error && articles.length > 0 && (
          <div className="tn-view-all-row">
            <a
              href="/#/tech-news"
              className="tn-view-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-solid fa-newspaper" aria-hidden="true" />
              View all {articles.length} articles in {activeTabMeta?.label}
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            </a>
          </div>
        )}

      </div>
    </section>
  );
}
