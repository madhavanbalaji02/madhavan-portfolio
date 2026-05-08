import React from 'react';

const categoryMeta = {
  ai:  { icon: 'fas fa-brain',     gradient: 'linear-gradient(135deg, #0d1f3c 0%, #1a3a5c 100%)', accent: '#00f2ff' },
  cv:  { icon: 'fas fa-eye',       gradient: 'linear-gradient(135deg, #1a0d2e 0%, #2d1b4e 100%)', accent: '#d4b595' },
  ml:  { icon: 'fas fa-chart-line', gradient: 'linear-gradient(135deg, #0d2a1a 0%, #1a4a2e 100%)', accent: '#4ade80' },
};

const langMeta = {
  'Python':          { icon: 'fab fa-python',    color: '#3572A5' },
  'Jupyter Notebook':{ icon: 'fas fa-book-open', color: '#DA5B0B' },
};

const ProjectCard = ({ project, index }) => {
  const cat  = categoryMeta[project.category] || categoryMeta.ml;
  const lang = langMeta[project.language]      || { icon: 'fas fa-code', color: '#555' };

  return (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="proj-card fade-in-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="proj-card-header" style={{ background: cat.gradient }}>
        <i className={`${cat.icon} proj-cat-icon`} style={{ color: cat.accent }}></i>
        <span className="proj-lang-badge" style={{ background: lang.color }}>
          <i className={lang.icon}></i>
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
        <span className="proj-github-link">
          <i className="fab fa-github"></i>
          View on GitHub
          <i className="fas fa-arrow-up-right-from-square"></i>
        </span>
      </div>
    </a>
  );
};

export default ProjectCard;
