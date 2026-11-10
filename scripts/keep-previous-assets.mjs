// Keeps the previous deploys' JS/CSS files online after a new deploy.
//
// Why: file names are content-hashed (main.<hash>.css) and each GitHub Pages deploy
// replaces the whole site. HTML may be cached for up to 10 minutes (max-age=600) by
// the CDN or the browser, so right after a deploy a visitor can get the OLD page,
// which asks for OLD asset files that no longer exist, and sees an unstyled page.
//
// Fix: before publishing, download the static files the live site uses now (and the
// ones it carried from the deploy before that) into build/, so both stay available.
// Runs in CI between `npm run build` and the Pages upload. Never fails the deploy.

import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://madhavanbalaji.com';
const BUILD = 'build';

async function json(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

const exists = p => access(p).then(() => true, () => false);

// Only what an old HTML page needs to render: JS and CSS (skip source maps)
const assetPaths = manifest =>
  Object.values(manifest?.files || {}).filter(p => /^\/static\/.+\.(js|css)$/.test(p));

async function main() {
  const live = await json(`${SITE}/asset-manifest.json`);
  // The live site's own carried-over list = the deploy before the current one
  const older = await json(`${SITE}/previous-asset-manifest.json`).catch(() => null);

  const wanted = [...new Set([...assetPaths(live), ...assetPaths(older)])];
  let copied = 0;
  for (const p of wanted) {
    const dest = path.join(BUILD, p);
    if (await exists(dest)) continue;            // same file in the new build
    const res = await fetch(SITE + p, { cache: 'no-store' });
    if (!res.ok) continue;                         // already gone; nothing to keep
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    copied++;
  }

  // Next deploy reads this to keep one more generation alive
  await writeFile(path.join(BUILD, 'previous-asset-manifest.json'), JSON.stringify(live, null, 2));
  console.log(`Kept ${copied} JS/CSS file(s) from previous deploys (${wanted.length} checked)`);
}

main().catch(err => console.log(`Skipped keeping previous assets: ${err.message}`));
