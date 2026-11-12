import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsData } from './projectsData';
import { diagramsBySlug } from './ProjectDiagrams';
import useTechNewsLink from './useTechNewsLink';
import scrollToSection from '../scrollToSection';
import { useSeo, fitDescription, SITE_URL } from '../seo';

const ProjectDetail = ({ theme, toggleTheme }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find(p => p.slug === projectId);
  const Diagram = project ? diagramsBySlug[project.slug] : null;
  const openDemoInPlace = useTechNewsLink(project?.demo);   // same tab on phones for on-site demos

  const goBackToProjects = () => {
    navigate('/');
    setTimeout(() => {
      scrollToSection('#projects');
    }, 150);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  const path = project ? `/project/${project.slug}/` : `/project/${projectId}/`;
  useSeo(project ? {
    title: `${project.title} | ${project.categoryLabel.replace(/ \/ /g, "/")} Project by Madhavan Balaji`,
    description: fitDescription(project.description, project.tagline),
    path,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareSourceCode',
          name: project.title,
          headline: project.tagline,
          description: project.description,
          url: SITE_URL + path,
          codeRepository: project.github,
          programmingLanguage: project.language,
          keywords: [...project.tags, ...project.techStack.flatMap(g => g.items)].join(', '),
          author: { '@type': 'Person', name: 'Madhavan Balaji', url: SITE_URL + '/' },
          ...(project.demo && project.demo.startsWith('http') ? { sameAs: project.demo } : {}),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Madhavan Balaji', item: SITE_URL + '/' },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: SITE_URL + '/#projects' },
            { '@type': 'ListItem', position: 3, name: project.title, item: SITE_URL + path },
          ],
        },
      ],
    },
  } : { title: 'Project not found | Madhavan Balaji', path, noindex: true });

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
          <a
            href="/#projects"
            className="pd-back-btn"
            onClick={(e) => { e.preventDefault(); goBackToProjects(); }}
          >
            <i className="fas fa-arrow-left"></i>
            <span>All Projects</span>
          </a>
          <div className="pd-nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <i className={theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun'}></i>
            </button>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary pd-gh-btn"
                aria-label="Live Demo"
                onClick={openDemoInPlace}
              >
                <i className="fas fa-external-link-alt" aria-hidden="true"></i>
                <span className="pd-btn-label">Live Demo</span>
              </a>
            )}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary pd-gh-btn"
              aria-label="View on GitHub"
            >
              <i className="fab fa-github" aria-hidden="true"></i>
              <span className="pd-btn-label">View on GitHub</span>
            </a>
          </div>
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

        {/* Architecture diagram (when one exists for this project) */}
        {Diagram && (
          <figure className="pd-diagram">
            <Diagram />
            <figcaption className="pd-diagram-caption">System architecture</figcaption>
          </figure>
        )}

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

            {/* Live Demo CTA */}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-github-card pd-demo-card"
                onClick={openDemoInPlace}
              >
                <i className="fas fa-external-link-alt pd-github-icon"></i>
                <div>
                  <p className="pd-github-label">Live Demo</p>
                  <p className="pd-github-sub">Open deployed app →</p>
                </div>
              </a>
            )}

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
