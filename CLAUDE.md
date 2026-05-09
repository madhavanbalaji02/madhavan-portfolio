# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:3000
npm run build      # production build → build/
```

**Deploying to madhavanbalaji.com (GitHub Pages):**
```bash
npm run build
cp docs/CNAME build/CNAME
rm -rf docs/asset-manifest.json docs/assets docs/image1.jpg docs/index.html \
       docs/profile.jpg docs/resume.pdf docs/static docs/favicon*.* \
       docs/patent.pdf docs/teaching.jpg
cp -r build/. docs/
git add docs/ && git commit -m "..." && git push origin fixes-only:main
```

The `docs/` folder is what GitHub Pages serves. Always preserve `docs/CNAME` (`madhavanbalaji.com`). Push to `main` via `fixes-only:main` — the working branch is `fixes-only`.

## Architecture

**React 18 SPA with `HashRouter`** (required for GitHub Pages — no server-side routing). Routes:
- `/#/` → full portfolio (main page)
- `/#/project/:slug` → project detail page (`ProjectDetail.js`)

`HashRouter` is the reason all in-page anchor navigation uses `e.preventDefault()` + manual `scrollTo` instead of plain `<a href="#section">` links. The `Header.js` and `Footer.js` both implement this scroll pattern. Never replace these with bare anchor tags.

**Single source of truth for projects:** `src/components/projectsData.js` — used by both `Projects.js` (card grid) and `ProjectDetail.js` (full detail page). Each entry needs `id`, `slug` (URL param), `category` (`ai`/`cv`/`ml`), and all detail fields (`background`, `workflow[]`, `results[]`, `techStack[]`, `highlights[]`).

**All styles live in one file:** `src/index.css` — CSS custom properties at `:root`, then component styles in section order, then responsive breakpoints at the bottom. No CSS modules or styled-components.

**Skills icons** (`src/components/Skills.js`): PNG/SVG files in `public/assets/icons/`. Skill items support four icon types — `icon` (img path), `fa` (Font Awesome class), `emoji` (string), `badge` (2-letter text). SVG icons for newer tools (LangGraph, Ollama, DuckDB, Polars, Streamlit, HuggingFace, React) were downloaded from `cdn.simpleicons.org`. Ollama's icon was fetched with `/ffffff` fill to be visible on the dark background.

**iOS mobile overflow:** The hero marquee ticker (`<div class="hero-marquee">`) uses CSS `transform` animation which escapes `overflow:hidden` on iOS Safari. It is hidden on mobile (`display:none` at `≤768px`) and uses `clip-path:inset(0)` on desktop. The html/body use `overflow-x:clip` (not `hidden`) because `clip` is not bypassed by `position:fixed` children.

## Design System

- **Colors:** `--bg:#0b1519` (dark teal), `--gold:#d4b595`, `--cyan:#5ec4d4`, `--green:#4ade80`
- **Fonts:** Space Grotesk (headings/body), JetBrains Mono (code, labels, mono elements)
- **Section tags** render as `// EXPERIENCE` via `section-tag::before { content: '// ' }`
- **Glassmorphism cards** use `--bg-card` with `border: 1px solid var(--border)`

## Key Content Locations

| What | Where |
|---|---|
| All 10 projects (full detail) | `src/components/projectsData.js` |
| Skills grid (5 categories) | `src/components/Skills.js` |
| Experience + teaching story | `src/components/Experience.js` |
| Medium articles + HF Spaces | `src/components/Writing.js` |
| Patent details | `src/components/Patent.js` |
| Contact form (mailto-based) | `src/components/Contact.js` |
| SEO meta + JSON-LD Person schema | `public/index.html` |
| Teaching photo | `public/teaching.jpg` |
| Profile photo | `public/profile.jpg` |
| Resume | `public/resume.pdf` |
