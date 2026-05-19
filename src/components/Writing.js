import React, { useState, useEffect } from 'react';

const HuggingFaceIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{display:'inline-block',verticalAlign:'middle'}}>
    <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm-2.5 5.5c-.83 0-1.5.67-1.5 1.5S8.67 11.5 9.5 11.5 11 10.83 11 10s-.67-1.5-1.5-1.5zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 13c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"/>
  </svg>
);

const FALLBACK = [
  {
    title: 'Designing with Data: How Culture, Psychology, and Big Data Shape Modern Visual Communication',
    url: 'https://medium.com/@madhavanbalaji02/designing-with-data-how-culture-psychology-and-big-data-shape-modern-visual-communication-7549f81cd7de',
    date: 'Oct 2025',
    readTime: '6 min read',
  },
  {
    title: "How TSMC's 2nm Technology Will Revolutionize Machine Learning",
    url: 'https://medium.com/@madhavanbalaji02/how-tsmcs-2nm-technology-will-revolutionize-machine-learning-f8a5785cd07b',
    date: 'Apr 2025',
    readTime: '5 min read',
  },
  {
    title: 'From Photo to Ghibli: How AI Transforms Real Images into Studio Ghibli Magic',
    url: 'https://medium.com/@madhavanbalaji02/from-photo-to-ghibli-how-ai-transforms-real-images-into-studio-ghibli-magic-8ba97a2cd7b3',
    date: 'Apr 2025',
    readTime: '4 min read',
  },
];

function formatDate(pubDate) {
  try {
    return new Date(pubDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

function calcReadTime(html) {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200)) + ' min read';
}

function parseRSS(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  return Array.from(doc.querySelectorAll('item'))
    .slice(0, 3)
    .map(item => {
      const title = item.querySelector('title')?.textContent?.replace(/^<!\[CDATA\[|\]\]>$/g, '').trim() || '';
      const url = item.querySelector('link')?.textContent?.trim() ||
                  item.querySelector('guid')?.textContent?.trim() || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const content = item.getElementsByTagName('content:encoded')[0]?.textContent ||
                      item.querySelector('description')?.textContent || '';
      return { title, url, date: formatDate(pubDate), readTime: calcReadTime(content) };
    })
    .filter(a => a.title && a.url);
}

const spaces = [
  { name: 'DocuMind', url: 'https://huggingface.co/spaces/madhavan02/DocuMind' },
  { name: 'Multi-Style Image Transfer', url: 'https://huggingface.co/spaces/madhavan02/multi-style-image-transfer' },
  { name: 'OmniBridge Captioning', url: 'https://huggingface.co/spaces/madhavan02/OmniBridge' },
];

const Writing = () => {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    const feed = 'https://medium.com/feed/@madhavanbalaji02';
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed)}`;
    fetch(proxy)
      .then(r => { if (!r.ok) throw new Error(); return r.text(); })
      .then(text => {
        const parsed = parseRSS(text);
        setArticles(parsed.length ? parsed : []);
      })
      .catch(() => setArticles([]));
  }, []);

  const loading = articles === null;
  const failed = articles !== null && articles.length === 0;
  const displayArticles = (!loading && !failed) ? articles : FALLBACK;

  return (
    <section id="writing" className="section writing-section">
      <div className="container">
        <div className="writing-grid">

          {/* Medium Articles */}
          <div className="writing-col">
            <div className="writing-header">
              <span className="section-tag">writing</span>
              <h2 className="section-title">Medium Articles</h2>
              <a
                href="https://medium.com/@madhavanbalaji02"
                target="_blank"
                rel="noopener noreferrer"
                className="writing-profile-link"
              >
                <i className="fab fa-medium"></i>
                @madhavanbalaji02 ↗
              </a>
            </div>

            <div className="article-list">
              {loading ? (
                <p className="article-loading">Loading articles…</p>
              ) : (
                displayArticles.map((a, i) => (
                  <a
                    key={i}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-row"
                  >
                    <div className="article-meta">
                      <span className="article-date">{a.date}</span>
                      <span className="article-readtime">{a.readTime}</span>
                    </div>
                    <p className="article-title">{a.title}</p>
                    <span className="article-arrow">Read →</span>
                  </a>
                ))
              )}
            </div>
          </div>

          {/* HuggingFace */}
          <div className="writing-col">
            <div className="writing-header">
              <span className="section-tag">deployed</span>
              <h2 className="section-title">HuggingFace Spaces</h2>
              <a
                href="https://huggingface.co/madhavan02"
                target="_blank"
                rel="noopener noreferrer"
                className="writing-profile-link"
              >
                <HuggingFaceIcon />
                &nbsp;madhavan02 ↗
              </a>
            </div>

            <div className="spaces-list">
              {spaces.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="space-row"
                >
                  <div className="space-icon">
                    <HuggingFaceIcon />
                  </div>
                  <span className="space-name">{s.name}</span>
                  <span className="space-arrow">↗</span>
                </a>
              ))}
              <div className="spaces-note">
                Live demos · Running on HuggingFace Spaces
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Writing;
