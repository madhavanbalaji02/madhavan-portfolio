import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { projectsData } from './projectsData';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'ai',  label: 'AI / LLM' },
  { id: 'cv',  label: 'Computer Vision' },
  { id: 'ml',  label: 'ML / MLOps' },
  { id: 'data', label: 'Data Engineering' },
];

const INITIAL_SHOWN = 6;

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const allFiltered =
    activeFilter === 'all'
      ? projectsData
      : projectsData.filter(p => p.category === activeFilter);

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
            {projectsData.length} projects spanning autonomous agents, computer vision, data pipelines, and production ML
          </p>
        </div>

        <div className="project-filter fade-in-up">
          {filters.map(f => (
            <button
              key={f.id}
              className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
              onClick={(e) => {
                handleFilter(f.id);
                // On phones the chips scroll sideways: bring the chosen one fully into view
                e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="proj-grid">
          {/* All cards are rendered (so the static page and crawlers get every project);
              the collapsed ones are hidden with CSS while the app is running */}
          {allFiltered.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              collapsed={!showAll && index >= INITIAL_SHOWN}
            />
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
