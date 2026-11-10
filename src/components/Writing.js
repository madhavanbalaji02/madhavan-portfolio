import React from 'react';

// Brand mark: the hugging-face emoji, matching the hero's social links
const HuggingFaceIcon = () => (
  <span className="hf-emoji" role="img" aria-label="Hugging Face">🤗</span>
);

// Update this list when a new article is published.
// (Medium's RSS feed can't be fetched from the browser: it has no CORS headers.)
const ARTICLES = [
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

const spaces = [
  { name: 'DocuMind', url: 'https://huggingface.co/spaces/madhavan02/DocuMind' },
  { name: 'Multi-Style Image Transfer', url: 'https://huggingface.co/spaces/madhavan02/style-transfer-gan-lora' },
  { name: 'OmniBridge Captioning', url: 'https://huggingface.co/spaces/madhavan02/OmniBridge' },
];

const Writing = () => {
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
              {ARTICLES.map((a, i) => (
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
              ))}
            </div>
          </div>

          {/* HuggingFace */}
          <div className="writing-col">
            <div className="writing-header">
              <span className="section-tag">deployed</span>
              <h2 className="section-title">Hugging Face Spaces</h2>
              <a
                href="https://huggingface.co/madhavan02"
                target="_blank"
                rel="noopener noreferrer"
                className="writing-profile-link"
              >
                <HuggingFaceIcon />
                madhavan02 ↗
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
                Live demos · Running on Hugging Face Spaces
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Writing;
