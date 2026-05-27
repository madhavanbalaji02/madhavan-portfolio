const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const RSS_FEEDS = [
  { name: 'TechCrunch',   url: 'https://techcrunch.com/feed/',                      limit: 10, lang: 'English',  flag: '🇺🇸' },
  { name: 'The Verge',    url: 'https://www.theverge.com/rss/index.xml',             limit: 10, lang: 'English',  flag: '🇺🇸' },
  { name: 'Hacker News',  url: 'https://hnrss.org/frontpage',                        limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index',    limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'HuggingFace',  url: 'https://huggingface.co/blog/feed.xml',               limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'ArXiv CS.AI',  url: 'https://arxiv.org/rss/cs.AI',                        limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'ArXiv CS.LG',  url: 'https://arxiv.org/rss/cs.LG',                        limit:  8, lang: 'English',  flag: '🇺🇸' },
  { name: 'ArXiv CS.CV',  url: 'https://arxiv.org/rss/cs.CV',                        limit:  6, lang: 'English',  flag: '🇺🇸' },
  { name: 'Gigazine',     url: 'https://gigazine.net/news/rss_2.0/',                 limit:  6, lang: 'Japanese', flag: '🇯🇵' },
  { name: 'Golem.de',     url: 'https://rss.golem.de/rss.php?feed=RSS2.0',           limit:  6, lang: 'German',   flag: '🇩🇪' },
];

const CACHE_KEY = 'tech-news-v4';

// ── RSS parser ─────────────────────────────────────────────────────────────────

function cleanCDATA(str) {
  return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = block.match(re);
  return m ? cleanCDATA(m[1]).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

function extractAtomLink(block) {
  const m = block.match(/<link[^>]+href="([^"]+)"/i);
  return m ? m[1] : '';
}

function parseRSS(xml, feed) {
  const items = [];
  const re = /<item[\s>]([\s\S]*?)<\/item>|<entry[\s>]([\s\S]*?)<\/entry>/gi;
  let m;
  while ((m = re.exec(xml)) !== null && items.length < feed.limit) {
    const block = m[1] || m[2];
    const title = extractTag(block, 'title');
    const url   = extractAtomLink(block) || extractTag(block, 'link');
    if (!title || !url) continue;
    const pubDate     = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated');
    const description = (
      extractTag(block, 'description') ||
      extractTag(block, 'summary') ||
      extractTag(block, 'content')
    ).slice(0, 400);
    items.push({ title, url, source: feed.name, pubDate, description, sourceLang: feed.lang, sourceFlag: feed.flag });
  }
  return items;
}

async function fetchRSSFeeds() {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechNewsBot/1.0)' },
        cf: { cacheTtl: 300, cacheEverything: true },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return parseRSS(await res.text(), feed);
    })
  );
  const articles = [];
  results.forEach((r) => { if (r.status === 'fulfilled') articles.push(...r.value); });
  return articles;
}

// ── Claude API ─────────────────────────────────────────────────────────────────

async function callClaude(body, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2024-07-31',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function curateWithClaude(articles, apiKey) {
  const articleList = articles
    .map((a, i) =>
      `${i + 1}. [${a.source}] [${a.sourceLang} ${a.sourceFlag}] ${a.title}\n   URL: ${a.url}\n   Date: ${a.pubDate}\n   ${a.description}`
    )
    .join('\n\n');

  const data = await callClaude({
    model: 'claude-sonnet-4-6',
    max_tokens: 14000,
    system: [
      {
        type: 'text',
        text: `You are a personalized tech news curator for Madhavan Balaji, an AI/ML engineer whose research spans agentic AI systems, LLM reasoning, computer vision, and recommendation architectures.

From a mixed list of articles — which may include ArXiv preprints, ML blogs, general tech news, and non-English sources (Japanese/German) — select and organize the best stories into exactly 3 sections. All content must be in English.

SECTIONS (pick exactly 12 articles per section, no article may appear in more than one section):

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
   - STRONGLY prefer articles from non-English sources (Gigazine 🇯🇵, Golem.de 🇩🇪) — aim for at least 4 translated articles here
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
  }, apiKey);

  const rawText = data.content.find((b) => b.type === 'text')?.text ?? '';
  const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
  return JSON.parse(cleaned);
}

// ── Route handlers ─────────────────────────────────────────────────────────────

async function handleTechNews(request, env, ctx) {
  const forceRefresh = new URL(request.url).searchParams.get('refresh') === '1';

  if (!forceRefresh) {
    const cached = await env.TECH_NEWS_CACHE.get(CACHE_KEY, 'json');
    if (cached) return Response.json({ ...cached, fromCache: true }, { headers: CORS_HEADERS });
    // Cache miss — background refresh + ask client to retry
    ctx.waitUntil(refreshCache(env));
    return Response.json(
      { error: 'initializing', message: 'News is being fetched. Please refresh in 30 seconds.' },
      { status: 503, headers: CORS_HEADERS }
    );
  }

  // Force refresh — await fully so caller sees result or error
  try {
    await refreshCache(env);
    const fresh = await env.TECH_NEWS_CACHE.get(CACHE_KEY, 'json');
    if (fresh) return Response.json({ ...fresh, fromCache: false }, { headers: CORS_HEADERS });
    return Response.json({ error: 'empty', message: 'Refresh ran but cache is still empty' }, { status: 500, headers: CORS_HEADERS });
  } catch (err) {
    return Response.json({ error: 'refresh-failed', message: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

async function handleAnalyze(request, env) {
  const params = new URL(request.url).searchParams;
  const articleUrl = params.get('url');
  const title      = params.get('title');
  const source     = params.get('source') || '';
  const summary    = params.get('summary') || '';

  if (!articleUrl || !title) {
    return Response.json({ error: 'url and title are required' }, { status: 400, headers: CORS_HEADERS });
  }

  const cacheKey = `analyze-${btoa(encodeURIComponent(articleUrl)).slice(0, 48)}`;
  const cached = await env.TECH_NEWS_CACHE.get(cacheKey, 'json');
  if (cached) return Response.json({ ...cached, fromCache: true }, { headers: CORS_HEADERS });

  const data = await callClaude({
    model: 'claude-sonnet-4-6',
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
        content: `Analyze this article for me:\n\nTitle: ${title}\nSource: ${source}\nURL: ${articleUrl}\nBrief summary: ${summary}`,
      },
    ],
  }, env.ANTHROPIC_API_KEY);

  const rawText = data.content.find((b) => b.type === 'text')?.text ?? '';
  const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
  const result  = JSON.parse(cleaned);

  await env.TECH_NEWS_CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 86400 * 7 });
  return Response.json(result, { headers: CORS_HEADERS });
}

// ── Entry point ────────────────────────────────────────────────────────────────

async function refreshCache(env) {
  const articles = await fetchRSSFeeds();
  if (articles.length === 0) return;
  const curated = await curateWithClaude(articles, env.ANTHROPIC_API_KEY);
  const payload = { sections: curated, lastUpdated: new Date().toISOString(), fromCache: false };
  await env.TECH_NEWS_CACHE.put(CACHE_KEY, JSON.stringify(payload), { expirationTtl: 90000 });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const path = new URL(request.url).pathname;

    try {
      if (path === '/api/tech-news/analyze') return handleAnalyze(request, env);
      if (path === '/api/tech-news')         return handleTechNews(request, env, ctx);
      if (path === '/health')                return Response.json({ status: 'ok' }, { headers: CORS_HEADERS });
      return new Response('Not found', { status: 404, headers: CORS_HEADERS });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers: CORS_HEADERS });
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(refreshCache(env));
  },
};
