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
  { label: 'Projects',   value: '14 featured',            accent: false },
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
        <h2 className="section-title">Engineer. Researcher. Teacher.</h2>
      </div>

      <div className="about-wrapper">
        <div className="about-grid">
          <div className="about-content fade-in-up delay-1">
            <div className="about-text">
              <h3>Background</h3>
              <p>
                I'm <strong>Madhavan Balaji</strong>, an AI engineer with a Master's in Computer Science from
                Indiana University. I'm happiest where research meets engineering: taking an idea that works
                in a notebook and turning it into something people can actually rely on.
              </p>
              <p>
                I've built multi-agent systems on AWS that investigate outages and wait for a human to approve
                the fix, fine-tuned vision-language models on a supercomputer, reproduced and extended a study of
                how faithfully language models reason, and co-invented a published patent for elderly care.
              </p>
              <p>
                Teaching keeps me honest. As a <strong>Technical Instructor</strong> at Indiana University I led
                weekly algorithms workshops for 30+ students, and today I tutor Statistics for AI at MAC IUI.
                If I can't explain something simply, I don't understand it well enough yet.
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
