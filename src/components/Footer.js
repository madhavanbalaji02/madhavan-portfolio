import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Madhavan Balaji</h3>
            <p>AI Engineer</p>
            <p className="footer-tagline">Transforming ideas into intelligent solutions</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-social">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="https://github.com/madhavanbalaji02" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/madhavanbalaji/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="mailto:madbala@iu.edu" aria-label="Email" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Madhavan Balaji. All rights reserved.</p>
          <p className="footer-note">Built with passion and attention to detail</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

