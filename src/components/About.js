import React from 'react';
import Skills from './Skills';

const facts = [
  { label: 'Degree',     value: 'MS Computer Science',   accent: false },
  { label: 'University', value: 'Indiana University',     accent: false },
  { label: 'Location',   value: 'Indianapolis, IN',       accent: false },
  { label: 'Focus',      value: 'AI / ML Engineering',    accent: true  },
  { label: 'Status',     value: 'Open to Roles — 2026',   accent: true  },
  { label: 'Patent',     value: 'Filed — Govt. of India', accent: false },
  { label: 'Teaching',   value: '30+ students mentored',  accent: false },
  { label: 'Projects',   value: '10+ shipped',            accent: false },
];


const About = () => (
  <section id="about" className="section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">about</span>
        <h2 className="section-title">Who I Am</h2>
      </div>

      <div className="about-wrapper">
        <div className="about-grid">
          <div className="about-content fade-in-up delay-1">
            <div className="about-text">
              <h3>Background</h3>
              <p>
                I'm <strong>Madhavan Balaji</strong>, a Master's student in Computer Science at Indiana University
                and an AI Engineer driven by a passion for building intelligent systems that solve real-world
                problems. My work sits at the intersection of machine learning, computer vision, and applied AI —
                turning raw data into production-ready solutions.
              </p>
              <p>
                From engineering high-accuracy visual retrieval systems and multi-label classifiers to designing
                end-to-end ML pipelines, I bring both research depth and engineering discipline. I've published
                findings, filed patents, and shipped systems that perform — not just in notebooks, but in the real world.
              </p>
              <p>
                Beyond building, I care deeply about <strong>knowledge transfer</strong>. As a Technical Instructor
                at Indiana University, I've helped 30+ students unlock complex CS concepts through clear visual
                explanations, hands-on mentorship, and a community-first approach.
              </p>

              <div className="about-currently">
                <h3>Currently</h3>
                <p>
                  Building production AI systems at <strong>Indiana University</strong> ·
                  Graduating <strong>May 2026</strong> · Open to full-time AI/ML roles
                </p>
              </div>


            </div>
          </div>

          <div className="about-facts fade-in-up delay-2">
            {facts.map(f => (
              <div className="fact-row" key={f.label}>
                <span className="fact-label">{f.label}</span>
                <span className={`fact-value${f.accent ? ' accent' : ''}`}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Skills />
    </div>
  </section>
);

export default About;
