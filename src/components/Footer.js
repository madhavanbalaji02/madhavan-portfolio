import React from 'react';

import scrollToSection from '../scrollToSection';

const scrollTo = (e, id) => {
  e.preventDefault();
  scrollToSection(id);
};

const exploreLinks = [
  ['#about',      'About'],
  ['#experience', 'Experience'],
  ['#projects',   'Projects'],
  ['#patent',     'Patent'],
  ['#writing',    'Writing'],
  ['#contact',    'Contact'],
];

const socials = [
  { label: 'GitHub',       href: 'https://github.com/madhavanbalaji02',          icon: <i className="fab fa-github" /> },
  { label: 'LinkedIn',     href: 'https://www.linkedin.com/in/madhavanbalaji/',  icon: <i className="fab fa-linkedin" /> },
  { label: 'Medium',       href: 'https://medium.com/@madhavanbalaji02',         icon: <i className="fab fa-medium" /> },
  { label: 'Hugging Face', href: 'https://huggingface.co/madhavan02',            icon: <span className="footer-emoji" aria-hidden="true">🤗</span> },
  { label: 'Email',        href: 'mailto:madhavanbalaji02@gmail.com',            icon: <i className="fas fa-envelope" /> },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src={process.env.PUBLIC_URL + '/favicon.svg'}
              alt=""
              width="40"
              height="40"
              className="footer-mark"
            />
            <p className="footer-name">Madhavan Balaji</p>
            <p className="footer-role">AI Engineer · MS CS, Indiana University</p>
            <a href="#contact" className="footer-status" onClick={(e) => scrollTo(e, '#contact')}>
              <span className="footer-status-dot" aria-hidden="true" />
              Open to full-time AI/ML roles
            </a>
          </div>

          <nav className="footer-col" aria-label="Footer">
            <h2 className="footer-heading">Explore</h2>
            <ul className="footer-explore">
              {exploreLinks.map(([id, label]) => (
                <li key={id}>
                  <a href={id} onClick={(e) => scrollTo(e, id)}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h2 className="footer-heading">Connect</h2>
            <ul className="footer-social">
              {socials.map(s => {
                const external = s.href.startsWith('http');
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <span className="footer-social-icon">{s.icon}</span>
                      {s.label}
                      {external && <span className="footer-social-arrow" aria-hidden="true">↗</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Signature wordmark: decorative, the name is already in the brand block */}
        <p className="footer-wordmark" aria-hidden="true">Madhavan Balaji</p>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Madhavan Balaji</p>
          <p className="footer-crafted">
            <span className="footer-crafted-mark" aria-hidden="true">✦</span>
            Built with passion for detail
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
