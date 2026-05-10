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
        label: 'Curriculum Design',
        text: 'Students lacked structured resources for advanced algorithm topics — designed and delivered 20+ weekly workshops covering Dynamic Programming, Graph Theory, and Greedy algorithms, resulting in measurably improved problem-solving confidence across 30+ students.',
      },
      {
        label: 'Mentorship Impact',
        text: 'Students repeatedly got stuck on the same debugging patterns with no clear path forward — held weekly 1:1 code review sessions, identifying root-cause misconceptions and prescribing targeted fixes, reducing repeated errors and accelerating progress.',
      },
      {
        label: 'Community Building',
        text: 'Peer learning was fragmented and unsustained — built a structured peer-review and mentorship system from scratch, driving consistent engagement that outlasted individual sessions and created a self-reinforcing learning community.',
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
        label: 'Latency Reduction',
        text: 'Real-time CV pipeline was bottlenecked by slow feature extraction, causing unacceptable inference delays — re-engineered the image processing pipeline using optimized feature descriptors, cutting end-to-end latency by 30% and enabling true real-time performance.',
      },
      {
        label: 'Visual Retrieval System',
        text: 'No scalable visual search capability existed for the product catalog — designed and trained an end-to-end visual retrieval model from data preprocessing through deployment, achieving 90% retrieval accuracy on an internal benchmark.',
      },
      {
        label: 'Personalized Recommendations',
        text: 'Style recommendations were generic and failed to account for the breadth of 1,000+ product classes — built multi-label deep learning classifiers with fine-grained retrieval logic, delivering personalized recommendations that matched user intent across the full catalog.',
      },
    ],
    skills: ['Python', 'Computer Vision', 'Image Processing', 'Deep Learning', 'Data Analysis'],
  },
];

const teachingOutcomes = [
  {
    icon: 'fas fa-lightbulb',
    title: 'Situation: Students hit DP walls',
    text: 'Students repeatedly failed to generalize DP patterns beyond memorized templates — I had to rebuild my own mental model to explain the "why", and emerged with first-principles fluency I didn\'t have before.',
  },
  {
    icon: 'fas fa-project-diagram',
    title: 'Task: Make Graph Theory stick',
    text: 'Slides weren\'t working for graph traversal — I switched to live whiteboard BFS/DFS walkthroughs, which forced me to develop spatial intuition and dramatically improved student retention.',
  },
  {
    icon: 'fas fa-comments',
    title: 'Action: Treat confusion as a diagnostic',
    text: 'Instead of re-explaining, I learned to identify the exact misconception behind each question — a skill that now makes me a faster debugger and clearer communicator on engineering teams.',
  },
  {
    icon: 'fas fa-rocket',
    title: 'Result: Compounding technical fluency',
    text: 'Preparing 2–3 workshops per week compounded rapidly — I solved more algorithmic problems in one semester of teaching than in any prior year of solo study.',
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
                  <strong>Situation:</strong> 30+ students needed to build algorithmic fluency
                  under time pressure, with no existing visual curriculum for complex topics
                  like DP and Graph Theory. I was handed the problem and a blank whiteboard.
                </p>
              </div>

              <p className="teaching-body">
                <strong>Task:</strong> Design a repeatable weekly workshop format that could
                take students from zero intuition to confident problem-solving on topics like
                Dynamic Programming, BFS/DFS, and Greedy algorithms — without relying on
                rote memorization. The constraint: each session had to stand alone, since
                attendance varied week to week.
              </p>

              <p className="teaching-body">
                <strong>Action → Result:</strong> I rebuilt every topic from first principles
                using live whiteboard walkthroughs instead of slides, treating each student
                question as a diagnostic signal rather than an interruption. Over 20+ sessions,
                students stopped asking "what is the pattern?" and started asking "which
                pattern fits here?" — a shift from recall to reasoning. As a side effect,
                preparing 2–3 workshops per week compounded my own fluency faster than any
                prior year of solo study.
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
