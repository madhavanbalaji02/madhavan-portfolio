// Tells IndexNow search engines (Bing, and through it Yahoo and DuckDuckGo; also
// Yandex, Seznam, Naver) that every URL in the sitemap changed, so they recrawl now
// instead of whenever they next get around to it.
//
// Ownership proof: a file named <key>.txt containing the key, served from the site
// root (public/<key>.txt). Runs after each deploy in .github/workflows/static.yml.

import { readFile, readdir } from 'node:fs/promises';

const HOST = 'madhavanbalaji.com';

const keyFile = (await readdir('public')).find(f => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file (public/<32 hex>.txt) found');
const key = (await readFile(`public/${keyFile}`, 'utf8')).trim();

const sitemap = await readFile('build/sitemap.xml', 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});

// 200 = accepted, 202 = accepted (key validation pending). Anything else is worth seeing,
// but a failed ping must never fail a deploy that already succeeded.
console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${res.status} ${res.statusText}`);
if (![200, 202].includes(res.status)) console.log(await res.text());
