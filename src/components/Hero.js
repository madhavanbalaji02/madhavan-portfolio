import React from 'react';

const Hero = () => (
  <header className="hero-bento" id="home">
    <div className="container">
      <div className="hero-inner">

        {/* Photo — shown at top on mobile via CSS order */}
        <div className="hero-profile">
          <div className="hero-img-wrap">
            <img src={process.env.PUBLIC_URL + '/profile.jpg'} alt="Madhavan Balaji" />
            <div className="hero-img-badge">AI Engineer</div>
          </div>
          <div className="hero-stack">
            {['PyTorch', 'LangGraph', 'FastAPI', 'Docker', 'K8s', 'PostgreSQL'].map(t => (
              <span key={t} className="hero-stack-tag">{t}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-status">
              <span className="hero-status-dot"></span>
              Available for opportunities
            </span>
          </div>

          <h1 className="hero-name">Madhavan<br />Balaji.</h1>
          <div className="hero-divider"></div>

          <p className="hero-role">AI Engineer · MS CS @ Indiana University</p>

          <p className="hero-desc">
            I build production AI systems — LLM pipelines, computer vision models,
            and the ML infrastructure that ships them at scale.
            Research-backed, engineering-disciplined.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">View Work</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Resume ↗
            </a>
          </div>

          <div className="hero-links">
            <a href="https://www.linkedin.com/in/madhavanbalaji/" target="_blank" rel="noopener noreferrer" className="hero-link">
              <i className="fab fa-linkedin"></i><span>LinkedIn</span>
            </a>
            <a href="https://github.com/madhavanbalaji02" target="_blank" rel="noopener noreferrer" className="hero-link">
              <i className="fab fa-github"></i><span>GitHub</span>
            </a>
            <a href="https://medium.com/@madhavanbalaji02" target="_blank" rel="noopener noreferrer" className="hero-link">
              <i className="fab fa-medium"></i><span>Medium</span>
            </a>
            <a href="https://huggingface.co/madhavan02" target="_blank" rel="noopener noreferrer" className="hero-link">
              <span>🤗</span><span>HF</span>
            </a>
            <span className="hero-location">Indianapolis, IN</span>
          </div>
        </div>

      </div>
    </div>

    <div className="hero-marquee">
      <div className="track">
        <span><b>AI Engineer</b> ✦ Machine Learning ✦ <b>LLMs</b> ✦ Computer Vision ✦ <b>MLOps</b> ✦ Data Science ✦ Research ✦ </span>
        <span><b>AI Engineer</b> ✦ Machine Learning ✦ <b>LLMs</b> ✦ Computer Vision ✦ <b>MLOps</b> ✦ Data Science ✦ Research ✦ </span>
      </div>
    </div>
  </header>
);

export default Hero;
