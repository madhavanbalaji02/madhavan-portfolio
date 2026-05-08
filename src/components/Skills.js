import React from 'react';

const skillCategories = [
  {
    title: 'Infra & MLOps',
    icon: 'fas fa-server',
    skills: [
      { name: 'Kubernetes',  icon: '/assets/icons/kubernetes.png' },
      { name: 'Docker',      icon: '/assets/icons/docker.png' },
      { name: 'Jenkins',     icon: '/assets/icons/jenkins.png' },
      { name: 'ArgoCD',      icon: '/assets/icons/argo.png' },
      { name: 'GCP',         icon: '/assets/icons/googlecloud.png' },
      { name: 'Airflow',     icon: '/assets/icons/apacheairflow.png' },
    ],
  },
  {
    title: 'ML / Deep Learning',
    icon: 'fas fa-brain',
    skills: [
      { name: 'Python',        icon: '/assets/icons/python.png' },
      { name: 'PyTorch',       icon: '/assets/icons/pytorch.png' },
      { name: 'TensorFlow',    icon: '/assets/icons/tensorflow.png' },
      { name: 'Scikit-learn',  icon: '/assets/icons/scikitlearn.png' },
      { name: 'C/C++',         icon: '/assets/icons/cplusplus.png' },
      { name: 'HuggingFace',   emoji: '🤗' },
      { name: 'LoRA',          badge: 'LR' },
      { name: 'GAN',           badge: 'GN' },
    ],
  },
  {
    title: 'LLM & AI Agents',
    icon: 'fas fa-robot',
    skills: [
      { name: 'LangGraph',         badge: 'LG' },
      { name: 'CrewAI',            badge: 'CA' },
      { name: 'Ollama',            badge: 'OL' },
      { name: 'ChromaDB',          badge: 'CR' },
      { name: 'LanceDB',           badge: 'LB' },
      { name: 'CLIP',              badge: 'CL' },
      { name: 'BLIP-2',            badge: 'B2' },
      { name: 'Stable Diffusion',  badge: 'SD' },
    ],
  },
  {
    title: 'DataOps & Versioning',
    icon: 'fas fa-database',
    skills: [
      { name: 'DVC',         icon: '/assets/icons/dvc.png' },
      { name: 'PostgreSQL',  icon: '/assets/icons/postgresql.png' },
      { name: 'Redis',       icon: '/assets/icons/redis.png' },
      { name: 'MySQL',       icon: '/assets/icons/mysql.png' },
      { name: 'Git',         icon: '/assets/icons/git.png' },
      { name: 'DuckDB',      badge: 'DK' },
      { name: 'Polars',      badge: 'PL' },
    ],
  },
  {
    title: 'Monitoring & Serving',
    icon: 'fas fa-chart-area',
    skills: [
      { name: 'Prometheus',    icon: '/assets/icons/prometheus.png' },
      { name: 'Grafana',       icon: '/assets/icons/grafana.png' },
      { name: 'FastAPI',       icon: '/assets/icons/fastapi.png' },
      { name: 'Flask',         icon: '/assets/icons/flask.png' },
      { name: 'Streamlit',     badge: 'ST' },
      { name: 'React',         fa: 'fab fa-react' },
      { name: 'Evidently AI',  badge: 'EV' },
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

const Skills = () => (
  <div className="skills-section fade-in-up">
    <h3 className="skills-title">Technical Expertise</h3>
    <p className="skills-subtitle">
      Comprehensive skills across infrastructure, ML/DL, LLM agents, data operations, and monitoring
    </p>

    <div className="skill-categories-wrapper">
      {skillCategories.map((category, ci) => (
        <div key={ci} className="skill-category">
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
      ))}
    </div>
  </div>
);

export default Skills;
