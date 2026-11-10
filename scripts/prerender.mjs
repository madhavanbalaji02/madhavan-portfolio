// Build-time prerender: turns the client-side React app into static HTML per route,
// so search engines, social previews and AI crawlers receive real content and each
// page's own <title>, meta description, canonical URL and JSON-LD.
//
// Runs after `react-scripts build` (see the "build" script in package.json):
//   1. serves build/ locally, the way GitHub Pages will (real files, SPA fallback)
//   2. loads every route in headless Chromium and saves the rendered HTML
//   3. writes sitemap.xml and a 404.html fallback for unknown URLs
// It fails the build if any page renders without its expected heading.

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(ROOT, 'build');
const SITE_URL = 'https://madhavanbalaji.com';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf',
  '.txt': 'text/plain', '.xml': 'application/xml', '.map': 'application/json',
};

// Project slugs come straight from the single source of truth.
async function projectSlugs() {
  const src = await readFile(path.join(ROOT, 'src/components/projectsData.js'), 'utf8');
  return [...src.matchAll(/^\s{4}slug: '([^']+)'/gm)].map(m => m[1]);
}

async function exists(p) {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

function serve(shell) {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(BUILD, urlPath);
    if (urlPath.endsWith('/')) file = path.join(file, 'index.html');
    if (file.startsWith(BUILD) && await exists(file)) {
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(await readFile(file));
      return;
    }
    // SPA fallback: always the untouched shell, never a prerendered page
    res.writeHead(200, { 'Content-Type': TYPES['.html'] });
    res.end(shell);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function main() {
  const shell = await readFile(path.join(BUILD, 'index.html'), 'utf8');
  const slugs = await projectSlugs();
  if (slugs.length === 0) throw new Error('No project slugs found in projectsData.js');

  // [route, selector that must contain text, whether it goes in the sitemap]
  const routes = [
    ['/', 'h1', true],
    ...slugs.map(s => [`/project/${s}/`, 'h1.pd-title', true]),
  ];

  const server = await serve(shell);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  // Keep the snapshot deterministic: no live news fetches baked into the HTML
  await page.route(/workers\.dev|\/api\//, r => r.abort());

  try {
    for (const [route, selector] of routes) {
      await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForSelector(selector, { timeout: 15000 });
      const heading = (await page.textContent(selector))?.trim();
      if (!heading) throw new Error(`Prerender of ${route} has an empty ${selector}`);

      const html = '<!DOCTYPE html>' + await page.evaluate(() => {
        // Runtime-only state that shouldn't be frozen into the static file
        document.documentElement.removeAttribute('style');
        document.documentElement.classList.remove('js');
        document.body.removeAttribute('style');
        return document.documentElement.outerHTML;
      });

      const out = route === '/' ? path.join(BUILD, 'index.html') : path.join(BUILD, route, 'index.html');
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, html);
      console.log(`  prerendered ${route.padEnd(42)} "${heading.slice(0, 40)}"`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  // Client-rendered routes that exist but aren't worth prerendering (noindex)
  await mkdir(path.join(BUILD, 'tech-news'), { recursive: true });
  await writeFile(path.join(BUILD, 'tech-news', 'index.html'), shell);
  // GitHub Pages serves 404.html (with a 404 status) for unknown URLs; the app shows its NotFound page
  await writeFile(path.join(BUILD, '404.html'), shell);

  const today = new Date().toISOString().slice(0, 10);
  const urls = routes.filter(r => r[2]).map(([route]) =>
    `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`);
  await writeFile(path.join(BUILD, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  console.log(`  wrote sitemap.xml (${urls.length} URLs), 404.html, tech-news/index.html`);
}

main().catch(err => {
  console.error('Prerender failed:', err.message);
  process.exit(1);
});
