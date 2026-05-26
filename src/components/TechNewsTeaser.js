import React from 'react';
import './TechNewsTeaser.css';

export default function TechNewsTeaser() {
  return (
    <section className="tnt-section">
      <div className="container tnt-inner">

        {/* Left: copy */}
        <div className="tnt-copy">
          <div className="tnt-eyebrow">
            <span className="tnt-eyebrow-dot" />
            AI-Powered · Updated Daily
          </div>

          <h2 className="tnt-headline">Daily Tech Intel</h2>

          <p className="tnt-desc">
            A daily briefing spanning global AI research, industry moves, and world tech news —
            automatically filtered to your interests, stack, and research channels.
            International sources translated to English.
          </p>

          <div className="tnt-pills">
            <span className="tnt-pill tnt-pill-purple">
              <i className="fa-solid fa-star" /> For You · AI / LLM
            </span>
            <span className="tnt-pill tnt-pill-green">
              <i className="fa-solid fa-flask" /> My Stack · Research
            </span>
            <span className="tnt-pill tnt-pill-blue">
              <i className="fa-solid fa-globe" /> 🌍 Global · Translated
            </span>
          </div>

          <a
            className="tnt-cta"
            href="/#/tech-news"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-newspaper" />
            Open Tech News
            <i className="fa-solid fa-arrow-up-right-from-square tnt-cta-ext" />
          </a>
        </div>

        {/* Right: preview cards (decorative) */}
        <div className="tnt-preview" aria-hidden="true">
          <div className="tnt-card tnt-card-1">
            <span className="tnt-cb tnt-cb-purple">AI</span>
            <span className="tnt-ct">New Reasoning Architecture Beats CoT on Math and Code Benchmarks…</span>
            <span className="tnt-cs">ArXiv CS.AI · 1h ago</span>
          </div>
          <div className="tnt-card tnt-card-2">
            <span className="tnt-cb tnt-cb-blue">My Stack</span>
            <span className="tnt-ct">Mechanistic Interpretability in Chain-of-Thought Reasoning…</span>
            <span className="tnt-cs">HuggingFace Blog · 3h ago</span>
          </div>
          <div className="tnt-card tnt-card-3">
            <span className="tnt-cb tnt-cb-green">🇩🇪 Translated</span>
            <span className="tnt-ct">EU AI Act Enforcement Begins — What Changes for Developers…</span>
            <span className="tnt-cs">Golem.de · 5h ago</span>
          </div>
        </div>

      </div>
    </section>
  );
}
