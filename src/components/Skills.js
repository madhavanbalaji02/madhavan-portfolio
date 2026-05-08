import React, { useEffect, useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Skills = () => {
  const skillsRef = useRef(null);
  const isVisible = useIntersectionObserver(skillsRef, { threshold: 0.3 });

  const skillCategories = [
    {
      title: 'Infra Orchestration',
      icon: 'fas fa-server',
      skills: [
        { name: 'Kubernetes', icon: '/assets/icons/kubernetes.png' },
        { name: 'Docker', icon: '/assets/icons/docker.png' },
        { name: 'Jenkins', icon: '/assets/icons/jenkins.png' },
        { name: 'ArgoCD', icon: '/assets/icons/argo.png' },
        { name: 'GCP', icon: '/assets/icons/googlecloud.png' },
        { name: 'Airflow', icon: '/assets/icons/apacheairflow.png' }
      ]
    },
    {
      title: 'ML/Deep Learning',
      icon: 'fas fa-brain',
      skills: [
        { name: 'Python', icon: '/assets/icons/python.png' },
        { name: 'C/C++', icon: '/assets/icons/cplusplus.png' },
        { name: 'TensorFlow', icon: '/assets/icons/tensorflow.png' },
        { name: 'PyTorch', icon: '/assets/icons/pytorch.png' },
        { name: 'Scikit-learn', icon: '/assets/icons/scikitlearn.png' }
      ]
    },
    {
      title: 'DataOps & Versioning',
      icon: 'fas fa-database',
      skills: [
        { name: 'DVC', icon: '/assets/icons/dvc.png' },
        { name: 'PostgreSQL', icon: '/assets/icons/postgresql.png' },
        { name: 'Redis', icon: '/assets/icons/redis.png' },
        { name: 'MySQL', icon: '/assets/icons/mysql.png' },
        { name: 'Git', icon: '/assets/icons/git.png' }
      ]
    },
    {
      title: 'Monitoring & Serving',
      icon: 'fas fa-chart-area',
      skills: [
        { name: 'Prometheus', icon: '/assets/icons/prometheus.png' },
        { name: 'Grafana', icon: '/assets/icons/grafana.png' },
        { name: 'FastAPI', icon: '/assets/icons/fastapi.png' },
        { name: 'Flask', icon: '/assets/icons/flask.png' }
      ]
    }
  ];

  return (
    <div className="skills-section fade-in-up" ref={skillsRef}>
      <h3 className="skills-title">Technical Expertise</h3>
      <p className="skills-subtitle">Comprehensive skills across infrastructure, ML/DL, data operations, and monitoring</p>

      <div className="skill-categories-wrapper">
        {skillCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="skill-category">
            <h4 className="skill-category-title">
              <i className={category.icon}></i> {category.title}
            </h4>
            <div className="skills-grid">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="skill-item">
                  <img src={skill.icon} alt={skill.name} className="skill-icon" />
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;

