/**
 * One-shot refresh: fetch RSS → Claude → write /tmp/news-data.json
 * Run: node refresh.js  (from server/)
 */
require('dotenv').config();
const Parser    = require('rss-parser');
const Anthropic = require('@anthropic-ai/sdk');
const fs        = require('fs');

const parser = new Parser({ timeout: 12000 });
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RSS_FEEDS = [
  { name: 'TechCrunch',   url: 'https://techcrunch.com/feed/',                   limit: 10, lang: 'English',  flag: '🇺🇸' },
  { name: 'The Verge',    url: 'https://www.theverge.com/rss/index.xml',          limit: 10, lang: 'English',  flag: '🇺🇸' },
  { name: 'Hacker News',  url: 'https://hnrss.org/frontpage',                     limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'HuggingFace',  url: 'https://huggingface.co/blog/feed.xml',            limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'ArXiv CS.AI',  url: 'https://arxiv.org/rss/cs.AI',                     limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'ArXiv CS.LG',  url: 'https://arxiv.org/rss/cs.LG',                     limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'ArXiv CS.CV',  url: 'https://arxiv.org/rss/cs.CV',                     limit:  6, lang: 'English',  flag: '🇺🇸' },
  { name: 'Gigazine',     url: 'https://gigazine.net/news/rss_2.0/',              limit:  6, lang: 'Japanese', flag: '🇯🇵' },
  { name: 'Golem.de',     url: 'https://rss.golem.de/rss.php?feed=RSS2.0',        limit:  6, lang: 'German',   flag: '🇩🇪' },
];

async function main() {
  console.log('[1/3] Fetching RSS feeds...');
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);
      return parsed.items.slice(0, feed.limit).map((item) => ({
        title:       (item.title || '').trim(),
        url:         item.link || '',
        source:      feed.name,
        pubDate:     item.pubDate || item.isoDate || '',
        description: (item.contentSnippet || item.content || item.summary || '').slice(0, 400),
        sourceLang:  feed.lang,
        sourceFlag:  feed.flag,
      }));
    })
  );

  const articles = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') articles.push(...r.value);
    else console.warn(`  [WARN] ${RSS_FEEDS[i].name}: ${r.reason.message}`);
  });
  console.log(`  → ${articles.length} articles collected`);

  console.log('[2/3] Curating with Claude...');
  const articleList = articles
    .map((a, i) =>
      `${i+1}. [${a.source}] [${a.sourceLang} ${a.sourceFlag}] ${a.title}\n   URL: ${a.url}\n   Date: ${a.pubDate}\n   ${a.description}`
    ).join('\n\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 14000,
    system: [{
      type: 'text',
      text: `You are a personalized tech news curator for Madhavan Balaji, an AI/ML engineer whose research spans agentic AI systems, LLM reasoning, computer vision, and recommendation architectures.

From a mixed list of articles — which may include ArXiv preprints, ML blogs, general tech news, and non-English sources (Japanese/German) — select and organize the best stories into exactly 3 sections. All content must be in English.

SECTIONS (pick exactly 12 articles per section, no article may appear in more than one section):
1. "forYou": Broad AI/ML news Madhavan would want to read (LLM releases, agentic AI, industry news, open-source)
2. "myStack": Technical research matching Madhavan's work (MLOps, alignment, multimodal/vision, RecSys). Prefer ArXiv/HuggingFace.
3. "aroundTheWorld": Global tech perspective. STRONGLY prefer Gigazine/Golem.de articles — aim for at least 4 translated.

RESPONSE FORMAT — return ONLY valid JSON, no markdown fences:
{"forYou":[{"title":"...","url":"...","source":"...","pubDate":"...","summary":"Two sentences: what happened + why it matters for AI/ML practitioners","category":"AI|Security|Gadgets|Software|Science","originalLanguage":"English","wasTranslated":false,"countryFlag":"🇺🇸"}],"myStack":[...],"aroundTheWorld":[...]}

RULES: 36 total (12 per section). No duplicates. English only. wasTranslated:true for JP/DE. category exactly one of: AI, Security, Gadgets, Software, Science.`,
      cache_control: { type: 'ephemeral' },
    }],
    messages: [{
      role: 'user',
      content: `Here are today's tech articles. Curate into 3 sections:\n\n${articleList}`,
    }],
  });

  const raw = response.content.find(b => b.type === 'text')?.text ?? '';
  const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
  const sections = JSON.parse(cleaned);

  const payload = {
    sections,
    lastUpdated: new Date().toISOString(),
    fromCache: false,
    stale: false,
  };

  console.log('[3/3] Writing /tmp/news-data.json...');
  fs.writeFileSync('/tmp/news-data.json', JSON.stringify(payload));
  const counts = Object.entries(sections).map(([k,v])=>`${k}:${v.length}`).join(', ');
  console.log(`  → Done. ${counts}`);
  console.log(`  → lastUpdated: ${payload.lastUpdated}`);
}

main().catch(err => { console.error('[ERROR]', err.message); process.exit(1); });
