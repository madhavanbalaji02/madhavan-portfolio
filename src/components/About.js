import React from 'react';
import Skills from './Skills';

const facts = [
  { label: 'Degree',     value: 'MS Computer Science',   accent: false },
  { label: 'University', value: 'Indiana University',     accent: false },
  { label: 'Location',   value: 'Indianapolis, IN',       accent: false },
  { label: 'Focus',      value: 'AI / ML Engineering',    accent: true  },
  { label: 'Status',     value: 'Open to Full-Time Roles', accent: true  },
  { label: 'Patent',     value: 'Published application, 2024', accent: false },
  { label: 'Teaching',   value: '30+ students mentored',  accent: false },
  { label: 'Projects',   value: '10+ shipped',            accent: false },
];


// A value that starts with a number ("30+ students mentored") counts up when seen
const FactValue = ({ text }) => {
  const m = /^(\d+)(.*)$/.exec(text);
  if (!m) return text;
  return <><span className="count" data-to={m[1]}>{m[1]}</span>{m[2]}</>;
};

const About = () => (
  <section id="about" className="section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">About</span>
        <h2 className="section-title">Who I Am</h2>
      </div>

      <div className="about-wrapper">
        <div className="about-grid">
          <div className="about-content fade-in-up delay-1">
            <div className="about-text">
              <h3>Background</h3>
              <p>
                I'm <strong>Madhavan Balaji</strong>, an AI Engineer with a Master's in Computer Science from
                Indiana University. I build systems that solve real problems, working across machine learning,
                computer vision, and applied AI to turn raw data into production-ready software.
              </p>
              <p>
                From engineering high-accuracy visual retrieval systems and multi-label classifiers to designing
                end-to-end ML pipelines, I bring both research depth and engineering discipline. I've published
                findings, filed a patent, and shipped systems that run in production, not just in notebooks.
              </p>
              <p>
                Beyond building, I care deeply about <strong>knowledge transfer</strong>. As a Technical Instructor
                at Indiana University, I helped 30+ students work through complex CS concepts with visual
                explanations and hands-on mentorship. Today I tutor Statistics for AI at MAC IUI.
              </p>

              <div className="about-currently">
                <h3>Currently</h3>
                <p>
                  Statistics Tutor at <strong>MAC IUI</strong> ·
                  MS CS, Indiana University, <strong>May 2026</strong> · Open to full-time AI/ML roles
                </p>
              </div>


            </div>
          </div>

          <div className="about-facts fade-in-up delay-2">
            {facts.map(f => (
              <div className="fact-row" key={f.label}>
                <span className="fact-label">{f.label}</span>
                <span className={`fact-value${f.accent ? ' accent' : ''}`}><FactValue text={f.value} /></span>
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
