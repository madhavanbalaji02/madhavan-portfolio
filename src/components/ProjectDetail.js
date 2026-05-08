import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsData } from './projectsData';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find(p => p.slug === projectId);

  const goBackToProjects = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = project ? `${project.title} — Madhavan Balaji` : 'Project — Madhavan Balaji';
    return () => { document.title = 'Madhavan Balaji | AI Engineer'; };
  }, [project]);

  if (!project) {
    return (
      <div className="pd-not-found">
        <div className="container">
          <h2>Project not found.</h2>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>← Back to portfolio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-page">
      {/* Top nav */}
      <nav className="pd-nav">
        <div className="container pd-nav-inner">
          <button className="pd-back-btn" onClick={() => goBackToProjects()}>
            <i className="fas fa-arrow-left"></i>
            <span>All Projects</span>
          </button>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary pd-gh-btn"
          >
            <i className="fab fa-github"></i> View on GitHub
          </a>
        </div>
      </nav>

      <div className="container pd-container">

        {/* Hero */}
        <div className="pd-hero">
          <div className="pd-hero-meta">
            <span className="pd-category-badge">
              <i className={project.catIcon}></i> {project.categoryLabel}
            </span>
            <span className="pd-lang-badge">
              <i className={project.langIcon}></i> {project.language}
            </span>
          </div>
          <h1 className="pd-title">{project.title}</h1>
          <p className="pd-tagline">{project.tagline}</p>

          <div className="pd-tag-row">
            {project.tags.map((t, i) => <span key={i} className="proj-tag">{t}</span>)}
          </div>
        </div>

        {/* Main grid */}
        <div className="pd-grid">

          {/* LEFT column */}
          <div className="pd-main">

            {/* Background */}
            <section className="pd-section">
              <h2 className="pd-section-title">
                <span className="pd-section-num">01</span> Background
              </h2>
              <p className="pd-body">{project.background}</p>
            </section>

            {/* Workflow */}
            <section className="pd-section">
              <h2 className="pd-section-title">
                <span className="pd-section-num">02</span> How It Works
              </h2>
              <div className="pd-workflow">
                {project.workflow.map((step, i) => (
                  <div key={i} className="pd-step">
                    <div className="pd-step-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="pd-step-body">
                      <h4 className="pd-step-title">{step.title}</h4>
                      <p className="pd-step-text">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Results */}
            <section className="pd-section">
              <h2 className="pd-section-title">
                <span className="pd-section-num">03</span> Results & Impact
              </h2>
              <div className="pd-results">
                {project.results.map((r, i) => (
                  <div key={i} className="pd-result-item">
                    <i className="fas fa-check-circle pd-result-icon"></i>
                    <p>{r}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT sidebar */}
          <aside className="pd-sidebar">

            {/* Tech Stack */}
            <div className="pd-sidebar-card">
              <h3 className="pd-sidebar-title">Tech Stack</h3>
              <div className="pd-tech-list">
                {project.techStack.map((group, i) => (
                  <div key={i} className="pd-tech-group">
                    <span className="pd-tech-group-label">{group.label}</span>
                    <div className="pd-tech-tags">
                      {group.items.map((item, j) => (
                        <span key={j} className="pd-tech-tag">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Highlights */}
            <div className="pd-sidebar-card">
              <h3 className="pd-sidebar-title">Key Highlights</h3>
              <ul className="pd-highlights">
                {project.highlights.map((h, i) => (
                  <li key={i} className="pd-highlight-item">
                    <span className="pd-hl-dot"></span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* GitHub CTA */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-github-card"
            >
              <i className="fab fa-github pd-github-icon"></i>
              <div>
                <p className="pd-github-label">Source Code</p>
                <p className="pd-github-sub">View full repository →</p>
              </div>
            </a>

          </aside>
        </div>

        {/* Footer nav */}
        <div className="pd-footer-nav">
          <button className="btn btn-ghost pd-footer-back" onClick={() => goBackToProjects()}>
            <i className="fas fa-arrow-left"></i> Back to all projects
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;
