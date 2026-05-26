/**
 * Tech News API Server — v2
 *
 * Pipeline:
 *   6 RSS feeds (4 English + Japanese + German) → ~16 articles →
 *   Claude claude-sonnet-4-6 (prompt-cached system block) →
 *   3 personalized sections: For You / Your Stack / Around the World →
 *   24-hour NodeCache
 *
 * Non-English articles (Japanese/German) are translated to English by Claude.
 * Prompt caching on the static system block cuts input token cost ~90% on hits.
 */

require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const Parser    = require('rss-parser');
const NodeCache = require('node-cache');
const Anthropic = require('@anthropic-ai/sdk');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('[ERROR] ANTHROPIC_API_KEY is not set. Create server/.env from .env.example');
  process.exit(1);
}

const app    = express();
const parser = new Parser({ timeout: 8000 });
const cache  = new NodeCache({ stdTTL: 86400 }); // 24-hour TTL
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json());

// ── RSS feed sources ───────────────────────────────────────────────────────────
const RSS_FEEDS = [
  // English — general tech
  { name: 'TechCrunch',   url: 'https://techcrunch.com/feed/',                      limit: 10, lang: 'English',  flag: '🇺🇸' },
  { name: 'The Verge',    url: 'https://www.theverge.com/rss/index.xml',             limit: 10, lang: 'English',  flag: '🇺🇸' },
  { name: 'Hacker News',  url: 'https://hnrss.org/frontpage',                        limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index',    limit:  8, lang: 'English',  flag: '🇺🇸' },
  // ML / AI research
  { name: 'HuggingFace',  url: 'https://huggingface.co/blog/feed.xml',               limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'ArXiv CS.AI',  url: 'https://arxiv.org/rss/cs.AI',                        limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'ArXiv CS.LG',  url: 'https://arxiv.org/rss/cs.LG',                        limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'ArXiv CS.CV',  url: 'https://arxiv.org/rss/cs.CV',                        limit:  6, lang: 'English',  flag: '🇺🇸' },
  // International
  { name: 'Gigazine',     url: 'https://gigazine.net/news/rss_2.0/',                 limit:  6, lang: 'Japanese', flag: '🇯🇵' },
  { name: 'Golem.de',     url: 'https://rss.golem.de/rss.php?feed=RSS2.0',           limit:  6, lang: 'German',   flag: '🇩🇪' },
];

const CACHE_KEY = 'tech-news-v4';

// ── Fetch and normalize RSS feeds ──────────────────────────────────────────────
async function fetchRSSFeeds() {
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
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    } else {
      console.warn(`[WARN] Failed to fetch ${RSS_FEEDS[i].name}: ${result.reason.message}`);
    }
  });

  return articles;
}

// ── Call Claude to curate into 3 personalized sections ────────────────────────
async function curateWithClaude(articles) {
  const articleList = articles
    .map((a, i) =>
      `${i + 1}. [${a.source}] [${a.sourceLang} ${a.sourceFlag}] ${a.title}\n   URL: ${a.url}\n   Date: ${a.pubDate}\n   ${a.description}`
    )
    .join('\n\n');

  const response = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 14000,

    system: [
      {
        type: 'text',
        text: `You are a personalized tech news curator for Madhavan Balaji, an AI/ML engineer whose research spans agentic AI systems, LLM reasoning, computer vision, and recommendation architectures.

From a mixed list of articles — which may include ArXiv preprints, ML blogs, general tech news, and non-English sources (Japanese/German) — select and organize the best stories into exactly 3 sections. All content must be in English.

SECTIONS (pick exactly 5 articles per section, no article may appear in more than one section):

1. "forYou": Broad AI/ML news and industry developments Madhavan would want to read:
   - Major LLM releases, benchmarks, or capability breakthroughs (Claude, GPT, Llama, Gemini, Mistral)
   - Agentic AI systems, multi-agent frameworks, autonomous pipelines
   - AI policy, regulation, safety debates affecting practitioners
   - Significant open-source model or tooling releases
   - AI industry funding, acquisitions, or strategic moves

2. "myStack": Research papers and applied work matching Madhavan's specific interests:
   - MLOps & Agentic DevOps: autonomous site reliability engineering, self-healing infrastructure AI agents, LLMs for automated debugging and incident response
   - LLM Alignment & Reasoning: chain-of-thought faithfulness, unlearning reasoning steps in LLMs, mechanistic interpretability, RLHF/DPO/Constitutional AI advances
   - Multimodal & Vision: vision transformers compute efficiency, multimodal generative architectures, image captioning, cross-modal models, CLIP/DINO variants
   - Recommendation Architectures: neural collaborative filtering, semantic search embeddings, retrieval-augmented recommendations, embedding-based ranking
   Prefer ArXiv papers, HuggingFace blog posts, and deep technical articles over general news for this section.

3. "aroundTheWorld": Global technology perspective with geographic diversity:
   - STRONGLY prefer articles from non-English sources (Gigazine 🇯🇵, Golem.de 🇩🇪) — aim for at least 2-3 translated articles here
   - International AI regulation (EU AI Act, Japan, China, Korea, India)
   - Geopolitics of AI chips, semiconductor supply chains, US-China tech competition
   - Non-US tech companies and research labs making global impact
   - Privacy legislation, surveillance tech, digital sovereignty

RESPONSE FORMAT — return ONLY valid JSON, no markdown fences, no commentary:
{
  "forYou": [
    {
      "title": "English title (translate from source language if needed)",
      "url": "original article URL",
      "source": "publication name",
      "pubDate": "original date string",
      "summary": "Exactly two sentences in English: sentence 1 = the key development or finding, sentence 2 = why it matters for AI/ML practitioners",
      "category": "exactly one of: AI, Security, Gadgets, Software, Science",
      "originalLanguage": "English",
      "wasTranslated": false,
      "countryFlag": "🇺🇸"
    }
  ],
  "myStack": [...same structure, prefer ArXiv/HuggingFace/technical sources...],
  "aroundTheWorld": [...same structure, prioritize non-English sources...]
}

RULES:
- Return exactly 12 articles in each section (36 total across all 3 sections)
- No article may appear in more than one section
- All summaries and titles must be in fluent English
- If source is in Japanese or German, set wasTranslated: true and translate the title faithfully
- For aroundTheWorld, use Gigazine or Golem.de articles wherever possible; aim for at least 4 translated articles in that section
- category must be exactly one of: AI, Security, Gadgets, Software, Science
- For ArXiv papers, use the paper title directly; format source as "ArXiv CS.AI", "ArXiv CS.LG", or "ArXiv CS.CV"`,
        cache_control: { type: 'ephemeral' },
      },
    ],

    messages: [
      {
        role: 'user',
        content: `Here are today's tech articles from global sources. Curate and organize them into the 3 sections:\n\n${articleList}`,
      },
    ],
  });

  const { input_tokens, cache_read_input_tokens = 0, cache_creation_input_tokens = 0 } = response.usage;
  const cacheStatus = cache_read_input_tokens > 0 ? 'HIT' : 'MISS';
  console.log(
    `[Claude] Cache ${cacheStatus} — input: ${input_tokens}, cache_read: ${cache_read_input_tokens}, cache_write: ${cache_creation_input_tokens}`
  );

  const rawText = response.content.find((b) => b.type === 'text')?.text ?? '';
  const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

  return JSON.parse(cleaned);
}

// ── GET /api/tech-news ─────────────────────────────────────────────────────────
app.get('/api/tech-news', async (req, res) => {
  const forceRefresh = req.query.refresh === '1';
  const cached = forceRefresh ? null : cache.get(CACHE_KEY);

  if (cached) {
    console.log('[Cache] Serving tech news from 24-hour cache');
    return res.json({ ...cached, fromCache: true });
  }

  console.log('[Fetch] Fetching fresh tech news from RSS feeds...');

  try {
    const articles = await fetchRSSFeeds();

    if (articles.length === 0) {
      return res.status(503).json({ error: 'All RSS feeds failed. Please try again later.' });
    }

    console.log(`[Fetch] Retrieved ${articles.length} articles, sending to Claude...`);

    const curated = await curateWithClaude(articles);

    const payload = {
      sections:    curated,
      lastUpdated: new Date().toISOString(),
      nextRefresh: new Date(Date.now() + 86400 * 1000).toISOString(),
      fromCache:   false,
    };

    cache.set(CACHE_KEY, payload);
    const total = Object.values(curated).reduce((n, arr) => n + (arr?.length ?? 0), 0);
    console.log(`[Cache] Cached ${total} curated articles across 3 sections for 24 hours`);

    res.json(payload);
  } catch (err) {
    console.error('[ERROR] Failed to process tech news:', err.message);

    const stale = cache.get(CACHE_KEY);
    if (stale) {
      console.log('[Cache] Serving stale cache after error');
      return res.json({ ...stale, stale: true, fromCache: true });
    }

    res.status(500).json({ error: 'Failed to fetch and curate tech news.', message: err.message });
  }
});

// ── GET /api/tech-news/analyze — full AI analysis for a single article ─────────
// Called on-demand when user opens the article detail view.
// Cached indefinitely per article URL so repeated opens are instant.
app.get('/api/tech-news/analyze', async (req, res) => {
  const { url, title, source, summary } = req.query;
  if (!url || !title) return res.status(400).json({ error: 'url and title are required' });

  const cacheKey = `analyze-${Buffer.from(url).toString('base64').slice(0, 48)}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json({ ...cached, fromCache: true });

  try {
    const response = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1200,
      system: [
        {
          type: 'text',
          text: `You are an expert AI/ML analyst writing deep technical summaries for Madhavan Balaji, a software engineer specializing in LLMs, agentic AI, computer vision, and MLOps.

Given an article's title, source, and brief summary, produce a structured deep-dive analysis.

RESPONSE FORMAT — return ONLY valid JSON, no markdown fences:
{
  "fullSummary": "A detailed 5-7 sentence analysis in English. Cover: (1) what exactly happened or was proposed, (2) the technical approach or mechanism, (3) benchmark results or evidence if any, (4) real-world implications for AI/ML practitioners, (5) how this connects to broader trends in the field.",
  "keyPoints": [
    "Concise, specific takeaway 1 (start with an action verb or key noun)",
    "Concise, specific takeaway 2",
    "Concise, specific takeaway 3",
    "Concise, specific takeaway 4"
  ]
}`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Analyze this article for me:\n\nTitle: ${title}\nSource: ${source || 'Unknown'}\nURL: ${url}\nBrief summary: ${summary || 'Not available'}`,
        },
      ],
    });

    const rawText = response.content.find((b) => b.type === 'text')?.text ?? '';
    const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    const result  = JSON.parse(cleaned);

    cache.set(cacheKey, result, 86400 * 7); // cache per-article for 7 days
    console.log(`[Analyze] Generated deep analysis for: ${title.slice(0, 60)}...`);
    res.json(result);
  } catch (err) {
    console.error('[Analyze] Error:', err.message);
    res.status(500).json({ error: 'Failed to generate analysis.', message: err.message });
  }
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', cached: cache.has(CACHE_KEY) });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Server] Tech news API running on http://localhost:${PORT}`);
  console.log(`[Server] Endpoint: http://localhost:${PORT}/api/tech-news`);
});
