import React from 'react';
import useTypingEffect from '../hooks/useTypingEffect';
import ParticlesCanvas from './ParticlesCanvas';

const Hero = () => {
  const texts = [
    'AI Engineer',
    'CS Grad Student',
    'ML Engineer',
    'AI Researcher'
  ];

  const displayText = useTypingEffect(texts, 100, 2000);

  return (
    <header className="hero-bento" id="home">
      <ParticlesCanvas />

      <div className="container">
        <div className="bento-grid-3col">

          {/* COLUMN 1: About & Stats */}
          <div className="bento-col span-col">
            <div className="bento-card about-card-ref">
              <div className="card-header">
                <i className="far fa-user"></i>
                <h3>ABOUT ME</h3>
              </div>
              <p>
                AI Engineer building intelligent systems at the intersection of machine learning,
                data science, and real-world impact. Passionate about LLMs, computer vision, and
                scalable ML pipelines.
              </p>
            </div>

            <div className="stats-row">
              <div className="bento-card stat-box">
                <span className="stat-num">MS</span>
                <span className="stat-lbl">CS @ IU</span>
              </div>
              <div className="bento-card stat-box">
                <span className="stat-num">10+</span>
                <span className="stat-lbl">PROJECTS</span>
              </div>
            </div>

            {/* Tech Stack Indicator (Bonus pill) */}
            <div className="bento-card tech-pill">
              <i className="fas fa-microchip"></i>
              <span>AI Engineer</span>
            </div>
          </div>

          {/* COLUMN 2: Profile Image */}
          <div className="bento-col center-col">
            <div className="bento-card profile-main">
              <div className="floating-icons">
                <i className="fab fa-aws icon-float p1"></i>
                <i className="fab fa-react icon-float p2"></i>
                <i className="fab fa-python icon-float p3"></i>
                <i className="fas fa-database icon-float p4"></i>
              </div>
              {/* Replace with actual image */}
              <div className="profile-img-wrapper">
                <img src={process.env.PUBLIC_URL + "/profile.jpg"} alt="Madhavan" className="main-pfp" />
              </div>
            </div>
          </div>

          {/* COLUMN 3: Socials & Resume */}
          <div className="bento-col right-col">
            <div className="bento-card social-box">
              <a href="https://www.linkedin.com/in/madhavanbalaji/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
              <a href="https://github.com/madhavanbalaji02" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
              <a href="mailto:madbala@iu.edu" target="_blank" rel="noopener noreferrer"><i className="fas fa-envelope"></i></a>
            </div>

            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="bento-card resume-box">
              <span>Resume</span>
              <i className="fas fa-arrow-up-right-from-square"></i>
            </a>

            <div className="bento-card experience-preview">
              <h3><i className="fas fa-briefcase"></i> EXPERIENCE</h3>
              <ul className="mini-exp-list">
                <li>
                  <span>Indiana University</span>
                  <small>Technical Instructor & Curriculum Lead</small>
                </li>
                <li>
                  <span>Coincent</span>
                  <small>Data Analyst Intern</small>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Marquee strip at bottom of hero */}
      <div className="hero-marquee">
        <div className="track">
          <span><b>AI Engineer</b> ✦ Machine Learning ✦ <b>LLMs</b> ✦ Computer Vision ✦ <b>Data Science</b> ✦ MLOps ✦ Research ✦ </span>
          <span><b>AI Engineer</b> ✦ Machine Learning ✦ <b>LLMs</b> ✦ Computer Vision ✦ <b>Data Science</b> ✦ MLOps ✦ Research ✦ </span>
        </div>
      </div>
    </header>
  );
};

export default Hero;

