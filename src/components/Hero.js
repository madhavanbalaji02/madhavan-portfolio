import React from 'react';

import scrollToSection from '../scrollToSection';

const scrollTo = (e, id) => {
  e.preventDefault();
  scrollToSection(id);
};

const Hero = () => (
  <header className="hero-bento" id="home">
    <div className="container">
      <div className="hero-inner">

        {/* Photo: shown at top on mobile via CSS order */}
        <div className="hero-profile">
          <div className="hero-img-wrap">
            <picture>
              <source srcSet={process.env.PUBLIC_URL + '/profile.webp'} type="image/webp" />
              <img src={process.env.PUBLIC_URL + '/profile.jpg'} alt="Portrait of Madhavan Balaji, AI and machine learning engineer" width="600" height="800" />
            </picture>
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
              Available now · Open to full-time AI/ML roles
            </span>
          </div>

          <h1 className="hero-name"><span className="hero-line"><span>Madhavan</span></span>{' '}<br /><span className="hero-line"><span>Balaji.</span></span></h1>
          <div className="hero-divider"></div>

          <p className="hero-role">AI Engineer · MS CS @ Indiana University</p>

          <p className="hero-hook">I build AI you can trust in the real world.</p>
          <p className="hero-desc">
            Agents that investigate outages and wait for your approval. Vision
            models that read the words in a photo. Research that asks whether an
            AI’s reasoning is honest. Every claim measured, every limit stated.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary" onClick={e => scrollTo(e, 'projects')}>See what I've built</a>
            <a href="/resume.html" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Resume ↗
            </a>
          </div>

          <ul className="hero-proof" aria-label="At a glance">
            <li><strong><span className="count" data-to="14">14</span></strong> projects, each with its own results</li>
            <li><strong>Published</strong> patent, 2024</li>
            <li><strong><span className="count" data-to="30">30</span>+</strong> students taught</li>
          </ul>

          <div className="hero-links">
            <a href="https://www.linkedin.com/in/madhavanbalaji/" target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i><span>LinkedIn</span>
            </a>
            <a href="https://github.com/madhavanbalaji02" target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="GitHub">
              <i className="fab fa-github"></i><span>GitHub</span>
            </a>
            <a href="https://medium.com/@madhavanbalaji02" target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="Medium">
              <i className="fab fa-medium"></i><span>Medium</span>
            </a>
            <a href="https://huggingface.co/madhavan02" target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="Hugging Face">
              <span>🤗</span><span>HF</span>
            </a>
            <a href="mailto:madhavanbalaji02@gmail.com" className="hero-link" aria-label="Email">
              <i className="fas fa-envelope"></i><span>Email</span>
            </a>
            <span className="hero-location">Indianapolis, IN</span>
          </div>
        </div>

      </div>
    </div>

    <div className="hero-marquee">
      <div className="track">
        <span><b>AI agents</b> ✦ Human approval built in ✦ <b>Computer vision</b> ✦ Models trained on a supercomputer ✦ <b>Data pipelines</b> ✦ Results you can verify ✦ <b>Published patent</b> ✦ </span>
        <span><b>AI agents</b> ✦ Human approval built in ✦ <b>Computer vision</b> ✦ Models trained on a supercomputer ✦ <b>Data pipelines</b> ✦ Results you can verify ✦ <b>Published patent</b> ✦ </span>
      </div>
    </div>
  </header>
);

export default Hero;
