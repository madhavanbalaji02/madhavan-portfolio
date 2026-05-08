import React from 'react';

const experiences = [
  {
    title: 'Technical Instructor & Curriculum Lead',
    company: 'Indiana University',
    location: 'Indianapolis, IN',
    period: 'Aug 2025 – Present',
    current: true,
    icon: 'fas fa-chalkboard-teacher',
    bullets: [
      {
        label: 'Education Contributions',
        text: 'Designed and delivered weekly technical workshops on Algorithms & Optimization to 30+ students, breaking down complex logic (Dynamic Programming, Graph Theory) into intuitive visual explanations.',
      },
      {
        label: 'Mentorship',
        text: 'Guided students in refactoring and optimal design patterns, mirroring Developer Relations (DevRel) responsibilities by debugging user issues and bridging knowledge gaps.',
      },
      {
        label: 'Community Building',
        text: 'Established a community-first mentorship and peer-review system to drive engagement, demonstrating the ability to build and sustain a technical community.',
      },
    ],
    skills: ['Algorithms', 'Dynamic Programming', 'Graph Theory', 'Mentorship', 'Curriculum Design'],
  },
  {
    title: 'Data Analyst Intern',
    company: 'Coincent',
    location: 'Bangalore, India',
    period: 'Sep 2022 – Nov 2022',
    current: false,
    icon: 'fas fa-chart-bar',
    bullets: [
      {
        label: 'Inference Optimization',
        text: 'Engineered feature extraction pipelines using advanced image processing, reducing latency by 30% for real-time computer vision performance.',
      },
      {
        label: 'Model Development',
        text: 'Developed an end-to-end visual retrieval system achieving 90% accuracy, effectively translating raw visual data into a functional visual search engine.',
      },
      {
        label: 'Recommendations',
        text: 'Built multi-label classifiers for 1,000+ distinct classes, optimizing personalized style recommendations through deep learning retrieval logic.',
      },
    ],
    skills: ['Python', 'Computer Vision', 'Image Processing', 'Deep Learning', 'Data Analysis'],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Experience</span>
          <h2 className="section-title">Professional Journey</h2>
          <p className="section-subtitle">Real-world impact through AI, data, and education</p>
        </div>

        <div className="exp-cards">
          {experiences.map((exp, index) => (
            <div key={index} className="exp-card fade-in-up">

              <div className="exp-card-left">
                <div className="exp-icon-wrap">
                  <i className={exp.icon}></i>
                </div>
                <div className="exp-meta">
                  <span className="exp-period">
                    <i className="fas fa-calendar-alt"></i> {exp.period}
                  </span>
                  <span className="exp-location">
                    <i className="fas fa-map-marker-alt"></i> {exp.location}
                  </span>
                  {exp.current && <span className="exp-badge">● Current</span>}
                </div>
                <div className="exp-skill-tags">
                  {exp.skills.map((skill, i) => (
                    <span key={i} className="exp-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="exp-divider"></div>

              <div className="exp-card-right">
                <div className="exp-header">
                  <h3 className="exp-title">{exp.title}</h3>
                  <span className="exp-company">
                    <i className="fas fa-building"></i> {exp.company}
                  </span>
                </div>
                <ul className="exp-bullets">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="exp-bullet-item">
                      <span className="exp-bullet-dot"></span>
                      <p>
                        <strong className="exp-bullet-label">{b.label}:</strong>{' '}
                        <span className="exp-bullet-text">{b.text}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
