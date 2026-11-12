import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTechNewsLink from './useTechNewsLink';

const categoryMeta = {
  ai: { icon: 'fas fa-brain',      accent: 'var(--cyan)' },
  cv: { icon: 'fas fa-eye',        accent: 'var(--gold)' },
  ml: { icon: 'fas fa-chart-line', accent: 'var(--t2)' },
  data: { icon: 'fas fa-database', accent: 'var(--t2)' },
};

const langMeta = {
  'Python':           { icon: 'fab fa-python',    color: '#3572A5' },
  'Jupyter Notebook': { icon: 'fas fa-book-open', color: '#DA5B0B' },
};

const ProjectCard = ({ project, index, collapsed = false }) => {
  const navigate  = useNavigate();
  const cat  = categoryMeta[project.category] || categoryMeta.ml;
  const lang = langMeta[project.language]      || { icon: 'fas fa-code', color: '#555' };

  const handleCardClick = () => {
    navigate(`/project/${project.slug}/`);
  };

  const handleGithubClick = e => {
    e.stopPropagation();
  };

  const openDemoInPlace = useTechNewsLink(project.demo);   // same tab on phones for on-site demos
  const handleDemoClick = e => {
    e.stopPropagation();
    openDemoInPlace(e);
  };

  return (
    <div
      className={`proj-card fade-in-up${collapsed ? ' is-collapsed' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={handleCardClick}
    >
      <div className="proj-card-header">
        <i className={`${project.catIcon || cat.icon} proj-cat-icon`} style={{ color: cat.accent }}></i>
        <div className="proj-card-header-right">
          {project.metric && (
            <span className="proj-metric-badge">{project.metric}</span>
          )}
          <span className="proj-lang-badge" style={{ borderColor: `${lang.color}44` }}>
            <i className={lang.icon} style={{ color: lang.color }}></i>
            {project.language}
          </span>
        </div>
      </div>

      <div className="proj-card-body">
        <h3 className="proj-title">{project.title}</h3>
        {/* The grid shows the one-line tagline; the full description is on the detail page */}
        <p className="proj-desc proj-desc-short">{project.tagline || project.description}</p>
        <p className="proj-desc proj-desc-long">{project.description}</p>
        <div className="proj-tags">
          {project.tags.map((tag, i) => (
            <span key={i} className="proj-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="proj-card-footer">
        <Link
          to={`/project/${project.slug}/`}
          className="proj-details-link"
          onClick={e => e.stopPropagation()}
        >
          <i className="fas fa-layer-group"></i>
          View Details
          <span className="sr-only"> about {project.title}</span>
          <i className="fas fa-arrow-right proj-details-arrow"></i>
        </Link>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-github-btn"
            onClick={handleDemoClick}
            aria-label="Live Demo"
          >
            <i className="fas fa-external-link-alt"></i>
          </a>
        )}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="proj-github-btn"
          onClick={handleGithubClick}
          aria-label="View on GitHub"
        >
          <i className="fab fa-github"></i>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
