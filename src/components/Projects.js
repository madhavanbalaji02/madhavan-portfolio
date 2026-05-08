import React, { useState } from 'react';
import ProjectCard from './ProjectCard';

const projects = [
  {
    id: 1,
    title: 'Chain-of-Thought Faithfulness',
    description: 'Investigates whether LLM chain-of-thought reasoning genuinely influences predictions using Negative Preference Optimization. Reveals that fine-tuning on high-quality CoT reduces faithfulness by 56–75% due to biased data curation — not training dynamics.',
    language: 'Jupyter Notebook',
    github: 'https://github.com/madhavanbalaji02/Chain-of-Thought-Faithfulness',
    category: 'ai',
    tags: ['LLMs', 'Chain-of-Thought', 'NLP', 'Research'],
  },
  {
    id: 2,
    title: 'DocuMind',
    description: 'Multi-agent research platform using LangGraph and CrewAI to orchestrate AI workflows that produce cited reports from custom knowledge bases. Combines hybrid RAG with REST APIs, Streamlit dashboards, and Claude Desktop MCP integration.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/DocuMind',
    category: 'ai',
    tags: ['Multi-Agent', 'RAG', 'LangGraph', 'CrewAI'],
  },
  {
    id: 3,
    title: 'Multi-Style Image Transfer',
    description: 'Transforms photos into art using GAN-based neural style transfer and Stable Diffusion with a custom Van Gogh LoRA adapter fine-tuned on 400 paintings. Supports Renaissance, Impressionism, and more through an interactive web interface.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/multi-style-image-transfer',
    category: 'cv',
    tags: ['GAN', 'Stable Diffusion', 'LoRA', 'Computer Vision'],
  },
  {
    id: 4,
    title: 'OmniBridge',
    description: 'Vision-language captioning system built on BLIP-2, fine-tuned with LoRA on TextCaps. Generates accurate image captions that incorporate visible text, significantly enhancing quality for text-heavy images across a high-performance inference pipeline.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/OmniBridge',
    category: 'cv',
    tags: ['BLIP-2', 'Vision-Language', 'LoRA', 'Fine-tuning'],
  },
  {
    id: 5,
    title: 'Hybrid Anime Recommendation System',
    description: 'Production-grade recommender combining content-based and collaborative filtering for personalized anime suggestions. Built with Flask, containerized via Docker and Kubernetes, with automated Jenkins and ArgoCD CI/CD pipelines.',
    language: 'Jupyter Notebook',
    github: 'https://github.com/madhavanbalaji02/Hybrid-Anime-Recommendation-System',
    category: 'ml',
    tags: ['Recommender', 'Flask', 'Kubernetes', 'MLOps'],
  },
  {
    id: 6,
    title: 'DentaVision',
    description: 'AI diagnostic system classifying dental conditions (caries, gingivitis) from patient images at 92.4% accuracy using a pretrained Vision Transformer. FastAPI backend and React frontend deliver sub-second inference latency for clinical use.',
    language: 'Jupyter Notebook',
    github: 'https://github.com/raghuveer9303/DentaVision',
    category: 'cv',
    tags: ['Vision Transformer', 'Medical AI', 'FastAPI', 'React'],
  },
];

const filters = [
  { id: 'all', label: 'All Projects' },
  { id: 'ai', label: 'AI / LLM' },
  { id: 'cv', label: 'Computer Vision' },
  { id: 'ml', label: 'Machine Learning' },
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Pinned GitHub projects spanning LLMs, computer vision, and production ML systems</p>
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
