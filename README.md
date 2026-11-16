<div align="center">

# Madhavan Balaji

**The portfolio of an AI engineer.**
Fast, honest, and made to feel good in your hand.

[**madhavanbalaji.com**](https://madhavanbalaji.com) · [Résumé](https://madhavanbalaji.com/resume.pdf) · [LinkedIn](https://www.linkedin.com/in/madhavanbalaji/) · [Hugging Face](https://huggingface.co/madhavan02) · [Medium](https://medium.com/@madhavanbalaji02)

[![Build & Deploy](https://github.com/madhavanbalaji02/madhavan-portfolio/actions/workflows/static.yml/badge.svg)](https://github.com/madhavanbalaji02/madhavan-portfolio/actions/workflows/static.yml)
[![Daily Tech Intel](https://github.com/madhavanbalaji02/madhavan-portfolio/actions/workflows/daily-news.yml/badge.svg)](https://github.com/madhavanbalaji02/madhavan-portfolio/actions/workflows/daily-news.yml)

</div>

---

## The work, front and centre.

Fourteen projects across AI agents, computer vision, data engineering and research, each with its own case study. Every number on the site comes from the project's own code and results, and every claim was checked against its repository.

## Designed around the details.

- **Liquid Glass navigation.** A glass lens marks where you are. Drag it, flick it, and it follows your finger on the same spring curves Apple uses in SwiftUI, with a haptic tick on supported phones.
- **Cards that open in place.** A project card grows into its case study, and shrinks back into the grid when you return.
- **Move the way you already do.** Swipe between projects on a phone or iPad, use two fingers on a trackpad, or press ← and → on a keyboard.
- **⌘K for everything.** Jump to any section, project or link from the keyboard. It opens instantly, by design.
- **Made for the thumb.** On phones, a floating tab bar and project bar sit where your thumb already is. Swipe the menu down to close it, as you would any sheet on iOS.
- **Always know where you are.** A reading guide tracks your progress through every case study.
- **Two moods.** A light theme with a sky that turns from afternoon to sunset as you scroll, and a calm dark theme.

## Fast by default.

Every page is prerendered to static HTML at build time, so it appears immediately and is fully readable before any JavaScript runs. The whole app ships at about 92 kB of JavaScript and 20 kB of CSS, compressed, and the project and news pages load only when they are needed.

## Easy to find. Easy to share.

Each page carries its own title, description, canonical URL, Open Graph and Twitter cards, and structured data (`Person`, `ProfilePage`, `WebSite`, `SoftwareSourceCode`, `BreadcrumbList`). A sitemap is generated on every build, and search engines are notified through IndexNow the moment a deploy goes live.

## Built for everyone.

Text meets WCAG AA contrast in both themes. Every control works with a keyboard and has a visible focus ring, icon-only buttons are labelled for screen readers, and touch targets are at least 44 points. Motion respects Reduce Motion, glass respects Reduce Transparency, and the layout holds from a 280‑pixel folding phone to an ultrawide display.

## Daily Tech Intel.

A briefing of the day's most important AI research and technology news, at [`/tech-news/`](https://madhavanbalaji.com/tech-news/). Every morning, ten sources in English, Japanese and German are gathered, and Claude chooses the stories worth reading, summarises them, and translates them into English. The result is served from the edge, so it opens instantly anywhere in the world.

## Built with.

| | |
|---|---|
| **Interface** | React 18, React Router 6, CSS custom properties, View Transitions API, Web Animations API |
| **Interaction** | Custom spring physics, Pointer Events, Vibration API |
| **Build** | Create React App, Playwright (headless Chromium prerendering) |
| **Hosting** | GitHub Pages, GitHub Actions, custom domain |
| **Search** | JSON-LD structured data, XML sitemap, IndexNow |
| **AI news pipeline** | Claude API with prompt caching, Node.js, Cloudflare Workers, Cloudflare KV, RSS and Atom parsing |
| **Quality** | Tested in Chrome, Safari and Firefox engines across phone, tablet and desktop sizes |

## Run it locally.

Requires Node.js 18 or later.

```bash
git clone https://github.com/madhavanbalaji02/madhavan-portfolio.git
cd madhavan-portfolio
npm install
npx playwright install chromium   # used by the prerender step
npm start                          # http://localhost:3000
```

`npm run build` creates the production site, prerendered, in `build/`. Pushing to `main` builds and deploys it automatically.

---

<div align="center">
<sub>© 2026 Madhavan Balaji. Designed and built with passion for detail.<br/>The code is shared for reference. The writing, images and personal materials may not be reused without permission.</sub>
</div>
