import React, { useState } from 'react';
import ProjectCard from './ProjectCard';

const projects = [
  {
    id: 1,
    title: 'Sovereign SRE',
    description: 'Autonomous infrastructure system that detects, diagnoses, and fixes production issues using AI agents with codebase awareness — eliminating manual SRE intervention. Multi-agent AI with human approval gates deploys fixes safely.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/Sovereign-SRE',
    category: 'ai',
    tags: ['LangGraph', 'CrewAI', 'Ollama', 'ChromaDB'],
  },
  {
    id: 2,
    title: 'LLM Inference Playground',
    description: 'Educational system exposing explicit control over transformer logit space — manual temperature scaling, top-K, and nucleus sampling without HuggingFace defaults. Tracks TTFT and throughput with a FastAPI + React interface.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/LLM-Inference-Education-Playground-',
    category: 'ai',
    tags: ['PyTorch', 'FastAPI', 'Transformers', 'React'],
  },
  {
    id: 3,
    title: 'VectorGaze',
    description: 'Edge AI system detecting workplace safety violations from video using natural language queries — no training data required. Combines CLIP zero-shot embeddings, Moondream2 reasoning, and LanceDB vector search on Apple Silicon.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/VectorGaze',
    category: 'cv',
    tags: ['CLIP', 'Zero-Shot', 'LanceDB', 'Edge AI'],
  },
  {
    id: 4,
    title: 'Project Aegis',
    description: 'Self-healing data quality system that automatically detects and repairs data drift using Evidently AI and DuckDB streaming. Scales from cloud (200MB) to local (100GB+) with a hybrid architecture and Streamlit dashboard.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/project-aegis',
    category: 'ml',
    tags: ['DuckDB', 'Evidently AI', 'Polars', 'Streamlit'],
  },
  {
    id: 5,
    title: 'Chain-of-Thought Faithfulness',
    description: 'Research into whether LLM chain-of-thought reasoning actually influences predictions using Negative Preference Optimization. Found fine-tuning on high-quality CoT reduces faithfulness by 56–75% — a data curation problem, not training.',
    language: 'Jupyter Notebook',
    github: 'https://github.com/madhavanbalaji02/Chain-of-Thought-Faithfulness',
    category: 'ai',
    tags: ['LLMs', 'NPO', 'NLP', 'Research'],
  },
  {
    id: 6,
    title: 'DocuMind',
    description: 'Multi-agent research platform using LangGraph and CrewAI to produce cited reports from custom knowledge bases. Combines hybrid RAG (dense + sparse) with REST APIs, Streamlit, and Claude Desktop MCP integration.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/DocuMind',
    category: 'ai',
    tags: ['Multi-Agent', 'RAG', 'LangGraph', 'CrewAI'],
  },
  {
    id: 7,
    title: 'OmniBridge',
    description: 'Vision-language captioning system built on BLIP-2, fine-tuned with LoRA on TextCaps. Generates accurate captions that incorporate visible text within images for significantly enhanced quality on text-heavy content.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/OmniBridge',
    category: 'cv',
    tags: ['BLIP-2', 'LoRA', 'Fine-tuning', 'Vision-Language'],
  },
  {
    id: 8,
    title: 'Multi-Style Image Transfer',
    description: 'Transforms photos into art using GAN-based neural style transfer and Stable Diffusion with a custom Van Gogh LoRA adapter fine-tuned on 400 paintings. Supports Renaissance, Impressionism, and more.',
    language: 'Python',
    github: 'https://github.com/madhavanbalaji02/multi-style-image-transfer',
    category: 'cv',
    tags: ['GAN', 'Stable Diffusion', 'LoRA', 'CV'],
  },
  {
    id: 9,
    title: 'Hybrid Anime Recommender',
    description: 'Production recommender combining content-based and collaborative filtering for personalized anime suggestions. Flask API, containerized via Docker and Kubernetes, with Jenkins + ArgoCD CI/CD pipelines.',
    language: 'Jupyter Notebook',
    github: 'https://github.com/madhavanbalaji02/Hybrid-Anime-Recommendation-System',
    category: 'ml',
    tags: ['Recommender', 'Kubernetes', 'ArgoCD', 'MLOps'],
  },
  {
    id: 10,
    title: 'DentaVision',
    description: 'AI diagnostic system classifying dental conditions (caries, gingivitis) at 92.4% accuracy using a pretrained Vision Transformer. FastAPI backend and React frontend deliver sub-second inference for clinical use.',
    language: 'Jupyter Notebook',
    github: 'https://github.com/raghuveer9303/DentaVision',
    category: 'cv',
    tags: ['ViT', 'Medical AI', 'FastAPI', 'React'],
  },
];

const filters = [
  { id: 'all',   label: 'All' },
  { id: 'ai',    label: 'AI / LLM' },
  { id: 'cv',    label: 'Computer Vision' },
  { id: 'ml',    label: 'ML / MLOps' },
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">projects</span>
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle">10 projects spanning autonomous agents, computer vision, and production ML</p>
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
