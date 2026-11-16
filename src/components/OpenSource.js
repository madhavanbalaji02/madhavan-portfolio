import React from 'react';

const VALUES = [
  ['Start with the user', 'I look for the moments where someone new gets stuck, and fix those first.'],
  ['Explain the why', 'Every change comes with its reasoning, its tests, and what I chose to leave alone.'],
  ['Leave it better', 'Small, careful improvements that make a tool clearer for the next person.'],
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

        <aside className="oss-side" aria-label="Where I contribute">
          <span className="oss-side-label">Currently contributing to</span>
          <a className="oss-repo" href="https://github.com/zenera-ai/ZeneraNeo" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github" aria-hidden="true" />
            <span>
              <span className="oss-repo-name">ZeneraNeo</span>
              <span className="oss-repo-about">A framework for building self-improving AI agent systems</span>
            </span>
          </a>
          <a className="oss-link" href="https://github.com/madhavanbalaji02" target="_blank" rel="noopener noreferrer">
            Follow along on GitHub
            <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
          </a>
        </aside>
      </article>
    </div>
  </section>
);

export default OpenSource;
