import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

// Every skill here is used in at least one of my GitHub repositories.
const skillCategories = [
  {
    title: 'LLMs & AI Agents',
    icon: 'fas fa-robot',
    skills: [
      { name: 'LangGraph',       icon: '/assets/icons/langgraph.svg' },
      { name: 'LangChain',       icon: '/assets/icons/langchain.svg' },
      { name: 'LlamaIndex',      fa: 'fas fa-layer-group' },
      { name: 'CrewAI',          fa: 'fas fa-people-group' },
      { name: 'MCP',             icon: '/assets/icons/modelcontextprotocol.svg' },
      { name: 'Claude API',      icon: '/assets/icons/claude.svg' },
      { name: 'OpenAI API',      fa: 'fas fa-comment-dots' },
      { name: 'Amazon Bedrock',  icon: '/assets/icons/amazonaws.svg' },
      { name: 'RAGAS',           fa: 'fas fa-scale-balanced' },
      { name: 'Ollama',          icon: '/assets/icons/ollama.svg' },
    ],
  },
  {
    title: 'RAG & Vector Search',
    icon: 'fas fa-magnifying-glass-chart',
    skills: [
      { name: 'Qdrant',                icon: '/assets/icons/qdrant.svg' },
      { name: 'pgvector',              icon: '/assets/icons/postgresql.png' },
      { name: 'ChromaDB',              fa: 'fas fa-circle-nodes' },
      { name: 'LanceDB',               fa: 'fas fa-bolt' },
      { name: 'Sentence-Transformers', fa: 'fas fa-vector-square' },
      { name: 'Hybrid Search (BM25)',  fa: 'fas fa-code-merge' },
      { name: 'Re-ranking',            fa: 'fas fa-arrow-down-wide-short' },
    ],
  },
  {
    title: 'ML, Vision & GenAI',
    icon: 'fas fa-brain',
    skills: [
      { name: 'Python',            icon: '/assets/icons/python.png' },
      { name: 'PyTorch',           icon: '/assets/icons/pytorch.png' },
      { name: 'TensorFlow',        icon: '/assets/icons/tensorflow.png' },
      { name: 'Scikit-learn',      icon: '/assets/icons/scikitlearn.png' },
      { name: 'HuggingFace',       icon: '/assets/icons/huggingface.svg' },
      { name: 'PEFT / LoRA / QLoRA', fa: 'fas fa-sliders' },
      { name: 'OpenCV',            icon: '/assets/icons/opencv.svg' },
      { name: 'YOLO',              fa: 'fas fa-crosshairs' },
      { name: 'Vision Transformers', fa: 'fas fa-eye' },
      { name: 'CLIP',              fa: 'fas fa-link' },
      { name: 'BLIP-2',            fa: 'fas fa-closed-captioning' },
      { name: 'Stable Diffusion',  fa: 'fas fa-wand-magic-sparkles' },
      { name: 'GAN',               fa: 'fas fa-arrows-spin' },
      { name: 'LightGBM',          fa: 'fas fa-tree' },
    ],
  },
  {
    title: 'Data Engineering',
    icon: 'fas fa-database',
    skills: [
      { name: 'SQL',          fa: 'fas fa-table' },
      { name: 'PostgreSQL',   icon: '/assets/icons/postgresql.png' },
      { name: 'Apache Spark', icon: '/assets/icons/apachespark.svg' },
      { name: 'Apache Kafka', icon: '/assets/icons/apachekafka.svg' },
      { name: 'dbt',          fa: 'fas fa-cubes' },
      { name: 'Delta Lake',   fa: 'fas fa-water' },
      { name: 'Airflow',      icon: '/assets/icons/apacheairflow.png' },
      { name: 'DuckDB',       icon: '/assets/icons/duckdb.svg' },
      { name: 'pandas',       icon: '/assets/icons/pandas.svg' },
      { name: 'NumPy',        icon: '/assets/icons/numpy.svg' },
      { name: 'Redis',        icon: '/assets/icons/redis.png' },
      { name: 'MySQL',        icon: '/assets/icons/mysql.png' },
    ],
  },
  {
    title: 'Cloud & MLOps',
    icon: 'fas fa-server',
    skills: [
      { name: 'AWS',            icon: '/assets/icons/amazonaws.svg' },
      { name: 'GCP',            icon: '/assets/icons/googlecloud.png' },
      { name: 'Docker',         icon: '/assets/icons/docker.png' },
      { name: 'Kubernetes',     icon: '/assets/icons/kubernetes.png' },
      { name: 'Terraform',      icon: '/assets/icons/terraform.svg' },
      { name: 'GitHub Actions', icon: '/assets/icons/githubactions.svg' },
      { name: 'Jenkins',        icon: '/assets/icons/jenkins.png' },
      { name: 'ArgoCD',         icon: '/assets/icons/argo.png' },
      { name: 'MLflow',         icon: '/assets/icons/mlflow.svg' },
      { name: 'DVC',            icon: '/assets/icons/dvc.png' },
      { name: 'Cloudflare Workers', icon: '/assets/icons/cloudflareworkers.svg' },
      { name: 'HPC / Slurm',    fa: 'fas fa-microchip' },
      { name: 'Git',            icon: '/assets/icons/git.png' },
    ],
  },
  {
    title: 'Apps, APIs & Testing',
    icon: 'fas fa-code',
    skills: [
      { name: 'FastAPI',     icon: '/assets/icons/fastapi.png' },
      { name: 'Flask',       icon: '/assets/icons/flask.png' },
      { name: 'Streamlit',   icon: '/assets/icons/streamlit.svg' },
      { name: 'Gradio',      icon: '/assets/icons/gradio.svg' },
      { name: 'React',       icon: '/assets/icons/reactjs.svg' },
      { name: 'Next.js',     icon: '/assets/icons/nextdotjs.svg' },
      { name: 'TypeScript',  icon: '/assets/icons/typescript.svg' },
      { name: 'pytest',      icon: '/assets/icons/pytest.svg' },
      { name: 'C/C++',       icon: '/assets/icons/cplusplus.png' },
    ],
  },
];

const SkillIcon = ({ skill }) => {
  if (skill.icon) {
    return <img src={skill.icon} alt={skill.name} className="skill-icon" />;
  }
  if (skill.fa) {
    return <i className={`${skill.fa} skill-icon-fa`}></i>;
  }
  if (skill.emoji) {
    return <span className="skill-emoji">{skill.emoji}</span>;
  }
  return <span className="skill-badge">{skill.badge}</span>;
};

const SkillCategory = ({ category, delay }) => {
  const ref = useRef(null);
  const visible = useIntersectionObserver(ref, { threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`skill-category skill-category-animate${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h4 className="skill-category-title">
        <i className={category.icon}></i> {category.title}
      </h4>
      <div className="skills-grid">
        {category.skills.map((skill, si) => (
          <div key={si} className="skill-item">
            <SkillIcon skill={skill} />
            <span className="skill-name">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Skills = () => (
  <div className="skills-section fade-in-up">
    <h3 className="skills-title">Technical Expertise</h3>
    <p className="skills-subtitle">
      Every tool here is one I've used in a real project, from LLM agents and retrieval to data pipelines and the cloud underneath
    </p>

    <div className="skill-categories-wrapper">
      {skillCategories.map((category, ci) => (
        <SkillCategory key={ci} category={category} delay={ci * 80} />
      ))}
    </div>
  </div>
);

export default Skills;
