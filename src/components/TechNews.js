/**
 * TechNews — AI-Powered Daily Tech Digest
 *
 * Architecture:
 *   Browser → GET /api/tech-news → Express server (localhost:3001)
 *     → rss-parser fetches 4 RSS feeds concurrently (Promise.allSettled)
 *     → top 10 raw articles sent to Claude claude-sonnet-4-6
 *     → Claude picks the 5 most important stories, writes 2-sentence summaries,
 *       assigns categories (AI / Security / Gadgets / Software / Science)
 *     → response cached server-side for 24 hours (node-cache)
 *     → structured JSON returned to this component
 *
 * Prompt caching (cache_control: ephemeral on the system block) means the
 * static curator instructions cost ~0.1× on repeated calls within 5 minutes,
 * dropping input token spend by ~90% on warm cache hits.
 *
 * Client-side: results are held in component state only — no localStorage.
 * A force-refresh (?refresh=1) can be triggered by the user to bypass the
 * 24-hour server cache and pull fresh articles on demand.
 */

import React, { useState, useEffect, useCallback } from 'react';
import './TechNews.css';

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60)   return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
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

// ── Sub-components ────────────────────────────────────────────────────────────

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
      <div className="tn-skeleton-line" style={{ width: '80%',  height: 13 }} />
      <div className="tn-skeleton-line" style={{ width: '60%',  height: 13 }} />
      <div className="tn-skeleton-line" style={{ width: '40%',  height: 13 }} />
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
        <span className="tn-ai-label">✨ AI Summary</span>
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

// ── Main component ────────────────────────────────────────────────────────────

const API_URL = 'http://localhost:3001/api/tech-news';

export default function TechNews() {
  const [articles,    setArticles]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [meta,        setMeta]        = useState(null); // { lastUpdated, fromCache, stale }
  const [refreshing,  setRefreshing]  = useState(false);

  const fetchNews = useCallback(async (force = false) => {
    const url = force ? `${API_URL}?refresh=1` : API_URL;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setArticles(data.articles ?? []);
      setMeta({
        lastUpdated: data.lastUpdated,
        fromCache:   data.fromCache,
        stale:       data.stale,
      });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load tech news.');
    }
  }, []);

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchNews().finally(() => setLoading(false));
  }, [fetchNews]);

  // Manual refresh
  async function handleRefresh() {
    setRefreshing(true);
    setError(null);
    await fetchNews(true);
    setRefreshing(false);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const cacheLabel = meta
    ? meta.stale
      ? 'stale cache'
      : meta.fromCache
        ? 'cached · refreshes daily'
        : 'just fetched'
    : null;

  const isStale = meta?.stale;

  return (
    <section id="tech-news" className="section">
      <div className="container">

        {/* Section header — matches other sections in the portfolio */}
        <div className="section-header">
          <span className="section-tag">tech news</span>
          <h2 className="section-title">Daily Tech Digest</h2>
          <p className="section-subtitle">
            AI-curated highlights from TechCrunch, The Verge, Hacker News, and Ars Technica —
            selected and summarized by Claude.
          </p>
        </div>

        {/* Controls row */}
        {!loading && (
          <div className="tn-controls">
            <div className="tn-meta">
              <span className={`tn-meta-dot${isStale ? ' stale' : ''}`} />
              {cacheLabel && <span>{cacheLabel}</span>}
              {meta?.lastUpdated && (
                <span>· updated {timeAgo(meta.lastUpdated)}</span>
              )}
            </div>

            <button
              className={`tn-refresh-btn${refreshing ? ' spinning' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh tech news"
            >
              <i className="fa-solid fa-rotate-right" aria-hidden="true" />
              {refreshing ? 'Refreshing…' : 'Refresh News'}
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="tn-grid">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <div className="tn-error">
              <div className="tn-error-icon">
                <i className="fa-solid fa-triangle-exclamation" />
              </div>
              <div className="tn-error-title">Could not load tech news</div>
              <p className="tn-error-msg">{error}</p>
              <button className="tn-refresh-btn" onClick={handleRefresh}>
                <i className="fa-solid fa-rotate-right" aria-hidden="true" />
                Try Again
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="tn-error">
              <div className="tn-error-icon">
                <i className="fa-solid fa-newspaper" />
              </div>
              <div className="tn-error-title">No articles available</div>
              <p className="tn-error-msg">All RSS feeds may be temporarily unavailable.</p>
              <button className="tn-refresh-btn" onClick={handleRefresh}>
                <i className="fa-solid fa-rotate-right" aria-hidden="true" />
                Retry
              </button>
            </div>
          ) : (
            articles.map((article, i) => (
              <NewsCard key={article.url ?? i} article={article} />
            ))
          )}
        </div>

      </div>
    </section>
  );
}
