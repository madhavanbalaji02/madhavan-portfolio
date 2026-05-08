import React from 'react';
import { useNavigate } from 'react-router-dom';

const categoryMeta = {
  ai: { icon: 'fas fa-brain',      accent: '#00f2ff' },
  cv: { icon: 'fas fa-eye',        accent: '#d4b595' },
  ml: { icon: 'fas fa-chart-line', accent: '#4ade80' },
};

const langMeta = {
  'Python':           { icon: 'fab fa-python',    color: '#3572A5' },
  'Jupyter Notebook': { icon: 'fas fa-book-open', color: '#DA5B0B' },
};

const ProjectCard = ({ project, index }) => {
  const navigate  = useNavigate();
  const cat  = categoryMeta[project.category] || categoryMeta.ml;
  const lang = langMeta[project.language]      || { icon: 'fas fa-code', color: '#555' };

  const handleCardClick = () => {
    navigate(`/project/${project.slug}`);
  };

  const handleGithubClick = e => {
    e.stopPropagation();
  };

  return (
    <div
      className="proj-card fade-in-up"
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={handleCardClick}
    >
      <div className="proj-card-header">
        <i className={`${cat.icon} proj-cat-icon`} style={{ color: cat.accent }}></i>
        <span className="proj-lang-badge" style={{ borderColor: `${lang.color}44` }}>
          <i className={lang.icon} style={{ color: lang.color }}></i>
          {project.language}
        </span>
      </div>

      <div className="proj-card-body">
        <h3 className="proj-title">{project.title}</h3>
        <p className="proj-desc">{project.description}</p>
        <div className="proj-tags">
          {project.tags.map((tag, i) => (
            <span key={i} className="proj-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="proj-card-footer">
        <span className="proj-details-link">
          <i className="fas fa-layer-group"></i>
          View Details
          <i className="fas fa-arrow-right proj-details-arrow"></i>
        </span>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="proj-github-btn"
          onClick={handleGithubClick}
          title="View on GitHub"
        >
          <i className="fab fa-github"></i>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
