import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { projectsData } from './projectsData';
import useGlassLens from './useGlassLens';

// `short` is shown on small phones so all five fit in one glass segmented control
const filters = [
  { id: 'all',  label: 'All',              short: 'All' },
  { id: 'ai',   label: 'AI / LLM',         short: 'AI' },
  { id: 'cv',   label: 'Computer Vision',  short: 'Vision' },
  { id: 'ml',   label: 'ML / MLOps',       short: 'MLOps' },
  { id: 'data', label: 'Data Engineering', short: 'Data' },
];

const FilterLabel = ({ f }) => (
  <>
    <span className="seg-full">{f.label}</span>
    <span className="seg-short" aria-hidden="true">{f.short}</span>
  </>
);

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

  // The filters are a Liquid Glass segmented control (useGlassLens.js), in both themes
  const lens = useGlassLens({ keys: filters.map((f) => f.id), active: activeFilter, onSelect: handleFilter, enabled: true });

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Projects</span>
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle">
            {projectsData.length} projects spanning autonomous agents, computer vision, data pipelines, and production ML
          </p>
        </div>

        <div className="project-filter proj-seg glass-bar fade-in-up" role="group" aria-label="Filter projects" {...lens.barProps}>
          {filters.map(f => (
            <button
              key={f.id}
              ref={lens.itemRef(f.id)}
              className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
              aria-pressed={activeFilter === f.id}
              aria-label={f.label}
              onClick={() => handleFilter(f.id)}
            >
              <FilterLabel f={f} />
            </button>
          ))}
          <span className="glass-lens" ref={lens.lensRef} aria-hidden="true">
            <span className="glass-lens-content" ref={lens.contentRef}>
              {filters.map(f => (
                <span key={f.id} ref={lens.ghostRef(f.id)} className="proj-seg-ghost glass-ghost"><FilterLabel f={f} /></span>
              ))}
            </span>
          </span>
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
