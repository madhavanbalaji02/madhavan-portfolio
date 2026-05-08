import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { projectsData } from './projectsData';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'ai',  label: 'AI / LLM' },
  { id: 'cv',  label: 'Computer Vision' },
  { id: 'ml',  label: 'ML / MLOps' },
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const filtered =
    activeFilter === 'all'
      ? projectsData
      : projectsData.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">projects</span>
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle">
            10 projects spanning autonomous agents, computer vision, and production ML
          </p>
        </div>

        <div className="project-filter fade-in-up">
          {filters.map(f => (
            <button
              key={f.id}
              className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="proj-grid">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
