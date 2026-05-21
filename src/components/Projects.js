import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { projectsData } from './projectsData';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'ai',  label: 'AI / LLM' },
  { id: 'cv',  label: 'Computer Vision' },
  { id: 'ml',  label: 'ML / MLOps' },
];

const INITIAL_SHOWN = 6;

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const allFiltered =
    activeFilter === 'all'
      ? projectsData
      : projectsData.filter(p => p.category === activeFilter);

  const visible = showAll ? allFiltered : allFiltered.slice(0, INITIAL_SHOWN);
  const hasMore = allFiltered.length > INITIAL_SHOWN;

  const handleFilter = (id) => {
    setActiveFilter(id);
    setShowAll(false);
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">projects</span>
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle">
            11 projects spanning autonomous agents, computer vision, and production ML
          </p>
        </div>

        <div className="project-filter fade-in-up">
          {filters.map(f => (
            <button
              key={f.id}
              className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
              onClick={() => handleFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="proj-grid">
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {hasMore && (
          <div className="proj-toggle-wrap">
            <button className="proj-toggle-btn" onClick={() => setShowAll(v => !v)}>
              {showAll
                ? 'Show Less ↑'
                : `Show More (${allFiltered.length - INITIAL_SHOWN} more) ↓`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
