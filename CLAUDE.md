# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:3000
npm run build      # react-scripts build + scripts/prerender.mjs → build/ (needs Playwright Chromium)
npm run build:spa  # React build only, no prerender
```

**Deploying to madhavanbalaji.com:** push to `main` (from the working branch: `git push origin fixes-only:main`). GitHub Pages is configured to deploy from **GitHub Actions** (`.github/workflows/static.yml`), which installs Chromium, runs `npm run build` (including the prerender) and publishes `build/`. The custom domain is set in the Pages settings. The `docs/` folder is a leftover from the old branch-folder setup and is **not** served.

**Updating the resume:**
`Madhavan Resume.pdf` in the repo root is the source of truth. When the user drops a new version there:
```bash
cp "Madhavan Resume.pdf" public/resume.pdf
file public/resume.pdf   # must say "PDF document", not "HTML document"
git add "Madhavan Resume.pdf" public/resume.pdf
git commit -m "Update resume" && git push origin fixes-only:main
```
Never download from a GitHub blob URL (`/blob/main/...`) — it returns HTML. Use the local file or `raw.githubusercontent.com`. Always verify with `file` before committing.

## Architecture

**React 18 SPA with `BrowserRouter`, prerendered to static HTML for SEO.** Routes:
- `/` → full portfolio (main page)
- `/project/:slug/` → project detail page (`ProjectDetail.js`); always link with the trailing slash (GitHub Pages 301s the slashless form)
- `/tech-news/` → Daily Tech Intel (`TechNewsPage.js`), `noindex` (aggregated third-party headlines)
- anything else → `404.html` (GitHub Pages returns it with a 404 status) → the app's `NotFound`

Old hash links (`/#/project/x`) are rewritten to real paths in `src/index.js` before the router starts.

**Prerender (`scripts/prerender.mjs`)** runs after the React build: it serves `build/`, renders `/` and every project route in headless Chromium, and writes the HTML to `build/<route>/index.html`, plus `sitemap.xml`, `404.html` and `tech-news/index.html`. Project routes come from the `slug:` lines in `projectsData.js`, so new projects are picked up automatically. The build fails if a page renders without its heading.

**Per-page SEO (`src/seo.js`):** every page calls `useSeo({ title, description, path, noindex, jsonLd })`, which sets the title, meta description, robots, canonical URL, Open Graph/Twitter tags and page JSON-LD. The prerender captures these into the static HTML. The site-wide `Person` and `WebSite` JSON-LD live in `public/index.html`; `public/robots.txt` points to the sitemap.

In-page section links (`#about`, `#projects`…) use `e.preventDefault()` + manual `scrollTo` (in `Header.js`, `Footer.js`) so they offset for the fixed navbar and work from detail pages (navigate home first, then scroll). Keep that pattern.

**Single source of truth for projects:** `src/components/projectsData.js` — used by both `Projects.js` (card grid) and `ProjectDetail.js` (full detail page). Each entry needs `id`, `slug` (URL param), `category` (`ai`/`cv`/`ml`/`data`), and all detail fields (`background`, `workflow[]`, `results[]`, `techStack[]`, `highlights[]`).

**All styles live in one file:** `src/index.css` — CSS custom properties at `:root`, then component styles in section order, then responsive breakpoints at the bottom. No CSS modules or styled-components.

**Skills icons** (`src/components/Skills.js`): PNG/SVG files in `public/assets/icons/`. Skill items support four icon types — `icon` (img path), `fa` (Font Awesome class), `emoji` (string), `badge` (2-letter text). SVG icons for newer tools (LangGraph, Ollama, DuckDB, Polars, Streamlit, HuggingFace, React) were downloaded from `cdn.simpleicons.org`. Ollama's icon was fetched with `/ffffff` fill to be visible on the dark background.

**iOS mobile overflow:** The hero marquee ticker (`<div class="hero-marquee">`) uses CSS `transform` animation which escapes `overflow:hidden` on iOS Safari. It is hidden on mobile (`display:none` at `≤768px`) and uses `clip-path:inset(0)` on desktop. The html/body use `overflow-x:clip` (not `hidden`) because `clip` is not bypassed by `position:fixed` children.

## Design System

**Light is the default theme** (`App.js`, plus an inline script in `public/index.html` that applies a saved `dark` choice before first paint). Light-mode rules live at the top of `src/index.css` under `[data-theme="light"]`; the values below are the dark theme.

- **Colors:** `--bg:#0b1519` (dark teal), `--gold:#d4b595`, `--cyan:#5ec4d4`, `--green:#4ade80`
- **Fonts:** Space Grotesk (headings/body), JetBrains Mono (code, labels, mono elements)
- **Section tags** render as `// EXPERIENCE` via `section-tag::before { content: '// ' }`
- **Glassmorphism cards** use `--bg-card` with `border: 1px solid var(--border)`

## Key Content Locations

| What | Where |
|---|---|
| All projects (full detail) | `src/components/projectsData.js` |
| Skills grid (5 categories) | `src/components/Skills.js` |
| Experience + teaching story | `src/components/Experience.js` |
| Medium articles + HF Spaces | `src/components/Writing.js` |
| Patent details | `src/components/Patent.js` |
| Contact form (mailto-based) | `src/components/Contact.js` |
| SEO meta + JSON-LD Person schema | `public/index.html` |
| Teaching photo | `public/teaching.jpg` |
| Profile photo | `public/profile.jpg` |
| Resume | `public/resume.pdf` |
