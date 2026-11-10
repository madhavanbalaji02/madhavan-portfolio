import { useEffect } from 'react';

// Per-page SEO: title, description, canonical URL, social previews and JSON-LD.
// Runs in the browser and during the build-time prerender (scripts/prerender.mjs),
// so the static HTML that crawlers receive already carries each page's own tags.

export const SITE_URL = 'https://madhavanbalaji.com';

export const DEFAULT_SEO = {
  title: 'Madhavan Balaji | AI Engineer',
  description:
    'Madhavan Balaji is an AI Engineer (MS CS, Indiana University) building production LLM pipelines, computer vision models and ML infrastructure.',
  path: '/',
  image: `${SITE_URL}/og-image.png`,
};

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setPageJsonLd(data) {
  const id = 'page-jsonld';
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSeo({ title, description, path, image, noindex = false, jsonLd = null }) {
  const t = title || DEFAULT_SEO.title;
  const d = description || DEFAULT_SEO.description;
  const url = SITE_URL + (path || DEFAULT_SEO.path);
  const img = image || DEFAULT_SEO.image;
  const ld = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = t;
    upsertMeta('name', 'description', d);
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    upsertCanonical(url);
    upsertMeta('property', 'og:title', t);
    upsertMeta('property', 'og:description', d);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', img);
    upsertMeta('name', 'twitter:title', t);
    upsertMeta('name', 'twitter:description', d);
    upsertMeta('name', 'twitter:image', img);
    setPageJsonLd(ld ? JSON.parse(ld) : null);
  }, [t, d, url, img, noindex, ld]);
}

// Search snippets cut off around 160 characters: use the full text when it fits,
// otherwise fall back to the shorter (complete-sentence) alternative.
export function fitDescription(full, short) {
  if (full && full.length <= 160) return full;
  return short || (full ? `${full.slice(0, full.lastIndexOf(' ', 156))}…` : '');
}
