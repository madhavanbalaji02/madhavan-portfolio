import React from 'react';

const experiences = [
  {
    title: 'Technical Instructor & Curriculum Lead',
    company: 'Indiana University',
    location: 'Indianapolis, IN',
    period: 'Aug 2025 – Dec 2025',
    current: false,
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

const teachingOutcomes = [
  {
    icon: 'fas fa-lightbulb',
    title: 'Teaching DP exposed my own gaps',
    text: 'Every time a student asked "but why does the subproblem boundary work here?", I had to rebuild my mental model from scratch — and came out sharper each time.',
  },
  {
    icon: 'fas fa-project-diagram',
    title: 'Graph Theory via whiteboard, not slides',
    text: 'Drawing BFS/DFS live forced me to develop spatial intuition I never got from textbooks. Visual teaching is fundamentally different from visual learning.',
  },
  {
    icon: 'fas fa-comments',
    title: 'Diagnosing mental blockers',
    text: "A student's confusion is a diagnostic signal — learning to read it made me a better debugger, interviewer, and communicator on engineering teams.",
  },
  {
    icon: 'fas fa-rocket',
    title: 'Weekly prep accelerated my fluency',
    text: 'Preparing workshops 2–3x per week compounded — I solved more LeetCode problems in one semester of teaching than in any prior year of solo study.',
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
          {/* Technical Instructor card */}
          <div className="exp-card fade-in-up">
            <div className="exp-card-left">
              <div className="exp-meta">
                <span className="exp-period">
                  <i className="fas fa-calendar-alt"></i> {experiences[0].period}
                </span>
                <span className="exp-location">
                  <i className="fas fa-map-marker-alt"></i> {experiences[0].location}
                </span>
                {experiences[0].current && <span className="exp-badge">● Current</span>}
              </div>
              <div className="exp-skill-tags">
                {experiences[0].skills.map((skill, i) => (
                  <span key={i} className="exp-skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="exp-divider"></div>

            <div className="exp-card-right">
              <div className="exp-header">
                <h3 className="exp-title">{experiences[0].title}</h3>
                <span className="exp-company">
                  <i className="fas fa-building"></i> {experiences[0].company}
                </span>
              </div>
              <ul className="exp-bullets">
                {experiences[0].bullets.map((b, i) => (
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

          {/* Teaching Story Section */}
          <div className="teaching-story fade-in-up">
            <div className="teaching-photo-wrap">
              <img
                src={process.env.PUBLIC_URL + '/teaching.jpg'}
                alt="Madhavan teaching at an Algorithms workshop, LeetCode problem projected on screen"
                className="teaching-photo"
              />
              <div className="teaching-photo-caption">
                <i className="fas fa-chalkboard-teacher"></i>
                <span>Weekly Algorithms workshop — Indiana University, 2025</span>
              </div>
            </div>

            <div className="teaching-narrative">
              <div className="teaching-callout">
                <i className="fas fa-quote-left teaching-quote-icon"></i>
                <p>
                  Teaching is the most efficient form of learning I've encountered.
                  Every whiteboard session — watching a student's face shift from
                  confusion to clarity on dynamic programming — sharpened my own
                  understanding in ways that hours of solo study never could.
                </p>
              </div>

              <p className="teaching-body">
                When I started leading weekly workshops on Algorithms & Optimization,
                I assumed I was there to give knowledge. What I didn't expect was how
                much I'd receive in return. Students ask the questions that textbooks
                skip — the "but <em>why</em> does this work?" questions that expose
                the gaps in your own mental model. Answering those questions live, at
                the whiteboard, forced me to rebuild my understanding from first
                principles. I stopped thinking in code and started thinking in structure.
              </p>

              <p className="teaching-body">
                Over dozens of sessions covering Graph Theory, DP, and Greedy algorithms,
                I developed a discipline I now carry into every engineering context: the
                ability to explain precisely — not approximately. That precision, earned
                through teaching, makes me a better collaborator, a cleaner code reviewer,
                and a sharper problem-solver.
              </p>

              <div className="teaching-outcomes-grid">
                {teachingOutcomes.map((outcome, i) => (
                  <div key={i} className="teaching-outcome-item">
                    <div className="outcome-icon">
                      <i className={outcome.icon}></i>
                    </div>
                    <div>
                      <h4 className="outcome-title">{outcome.title}</h4>
                      <p className="outcome-text">{outcome.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Analyst Intern card */}
          <div className="exp-card fade-in-up">
            <div className="exp-card-left">
              <div className="exp-meta">
                <span className="exp-period">
                  <i className="fas fa-calendar-alt"></i> {experiences[1].period}
                </span>
                <span className="exp-location">
                  <i className="fas fa-map-marker-alt"></i> {experiences[1].location}
                </span>
              </div>
              <div className="exp-skill-tags">
                {experiences[1].skills.map((skill, i) => (
                  <span key={i} className="exp-skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="exp-divider"></div>

            <div className="exp-card-right">
              <div className="exp-header">
                <h3 className="exp-title">{experiences[1].title}</h3>
                <span className="exp-company">
                  <i className="fas fa-building"></i> {experiences[1].company}
                </span>
              </div>
              <ul className="exp-bullets">
                {experiences[1].bullets.map((b, i) => (
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
        </div>
      </div>
    </section>
  );
};

export default Experience;
