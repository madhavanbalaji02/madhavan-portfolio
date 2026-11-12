import React from 'react';

// Details are taken from the official publication (public/patent.pdf):
// Indian Patent Office Journal No. 20/2024, dated 17 May 2024.
const RECORD = [
  ['Application no.', '202441035992 A'],
  ['Filed',           '7 May 2024'],
  ['Published',       '17 May 2024'],
  ['Journal',         'Patent Office Journal No. 20/2024'],
  ['Office',          'Indian Patent Office'],
  ['Role',            'Co-inventor'],
];

const CAPABILITIES = [
  ['Health monitoring',   'Continuous tracking of vital signs, with alerts when readings fall outside safe ranges.'],
  ['Medication management', 'Scheduled reminders and adherence tracking for daily medication.'],
  ['Emotion detection',   'Recognises signs of distress or low mood so carers can respond early.'],
  ['Companion assistant', 'A conversational assistant that offers everyday support and company.'],
];

const Patent = () => (
  <section id="patent" className="section patent-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">Patent</span>
        <h2 className="section-title">Patent & Research</h2>
        <p className="section-subtitle">A published patent application for an IoT system that supports elderly people living at home</p>
      </div>

      <article className="patent fade-in-up">
        <div className="patent-main">
          <p className="patent-kicker">
            <span className="patent-status">Published</span>
            Indian patent application
          </p>
          <h3 className="patent-title">CareMate: An Integrated Elderly Support System</h3>
          <p className="patent-description">
            An Internet of Things system that helps elderly people live independently and safely.
            It brings real-time health monitoring, medication management and personalised emotional
            support together in one connected platform for the person, their family and their carers.
          </p>
          <ul className="patent-capabilities">
            {CAPABILITIES.map(([name, text]) => (
              <li key={name}>
                <span className="patent-cap-name">{name}</span>
                <span className="patent-cap-text">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="patent-record" aria-label="Publication record">
          <dl>
            {RECORD.map(([k, v]) => (
              <div className="patent-record-row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <a className="patent-doc-link" href="/patent.pdf" target="_blank" rel="noopener noreferrer">
            View publication (PDF)
            <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
          </a>
        </aside>
      </article>
    </div>
  </section>
);

export default Patent;
