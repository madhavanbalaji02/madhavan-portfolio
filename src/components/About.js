import React from 'react';
import Skills from './Skills';

const About = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">Crafting Intelligent Solutions</h2>
          <p className="section-subtitle">Passionate about leveraging AI and machine learning to create meaningful impact</p>
        </div>

        <div className="about-wrapper">
          <div className="about-content fade-in-up delay-1">
            <div className="about-text">
              <h3>Who I Am</h3>
              <p>
                I'm <strong>Madhavan Balaji</strong>, a Master's student in Computer Science at Indiana University and an
                AI Engineer driven by a passion for building intelligent systems that solve real-world problems. My work
                sits at the intersection of machine learning, computer vision, and applied AI — turning raw data into
                production-ready solutions.
              </p>
              <p>
                From engineering high-accuracy visual retrieval systems and multi-label classifiers to designing end-to-end
                ML pipelines, I bring both research depth and engineering discipline. I've published findings, filed patents,
                and shipped systems that perform — not just in notebooks, but in the real world.
              </p>
              <p>
                Beyond building, I care deeply about <strong>knowledge transfer</strong>. As a Technical Instructor at Indiana
                University, I've helped 30+ students unlock complex CS concepts through clear visual explanations,
                hands-on mentorship, and a community-first approach. Good AI is only as powerful as the people who understand it.
              </p>
            </div>
          </div>
        </div>

        <Skills />
      </div>
    </section>
  );
};

export default About;

