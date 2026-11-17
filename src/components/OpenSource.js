import React from 'react';

const VALUES = [
  ['Start with the user', 'I look for the moments where someone new gets stuck, and fix those first.'],
  ['Explain the why', 'Every change comes with its reasoning, its tests, and what I chose to leave alone.'],
  ['Leave it better', 'Small, careful improvements that make a tool clearer for the next person.'],
];

const AREAS = [
  ['fas fa-robot', 'AI agent frameworks'],
  ['fas fa-terminal', 'Command-line tools'],
  ['fas fa-wand-magic-sparkles', 'Developer experience'],
  ['fas fa-vial', 'Testing and reliability'],
];

const OpenSource = () => (
  <section id="open-source" className="section oss-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">Open Source</span>
        <h2 className="section-title">Built in the open.</h2>
      </div>

      <article className="oss fade-in-up">
        <div className="oss-main">
          <p className="oss-kicker"><span className="oss-status">Contributor</span>Open-source AI tools</p>
          <p className="oss-lead">
            So much of what I’ve learned came from people who shared their work freely.
            Contributing back is how I say thank you.
          </p>
          <p className="oss-text">
            I contribute to open-source AI projects because I enjoy solving problems with clarity
            and care. The best software feels obvious to use, and that rarely happens by accident.
            It comes from someone noticing the small things and taking the time to get them right.
            That’s the part I love, and the open-source community is where I get to do it alongside
            people who care just as much.
          </p>
          <ul className="oss-values">
            {VALUES.map(([name, text]) => (
              <li key={name}>
                <span className="oss-value-name">{name}</span>
                <span className="oss-value-text">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="oss-side" aria-label="What I work on">
          <span className="oss-side-label">What I work on</span>
          <ul className="oss-areas">
            {AREAS.map(([icon, label]) => (
              <li key={label}><i className={icon} aria-hidden="true" />{label}</li>
            ))}
          </ul>
        </aside>
      </article>
    </div>
  </section>
);

export default OpenSource;
