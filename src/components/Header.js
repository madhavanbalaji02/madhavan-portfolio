import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const close = () => setIsMenuOpen(false);

  const navTo = (e, id) => {
    e.preventDefault();
    close();
    setTimeout(() => {
      const el = document.querySelector(id);
      if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    }, 10);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-brand">
            <a href="#home" onClick={(e) => navTo(e, '#home')}>MB</a>
          </div>

          {/* desktop nav */}
          <ul className="navbar-nav desktop-nav">
            <li><a href="#about"      onClick={(e) => navTo(e, '#about')}>About</a></li>
            <li><a href="#experience" onClick={(e) => navTo(e, '#experience')}>Experience</a></li>
            <li><a href="#projects"   onClick={(e) => navTo(e, '#projects')}>Projects</a></li>
            <li><a href="#patent"     onClick={(e) => navTo(e, '#patent')}>Achievements</a></li>
            <li><a href="#writing"    onClick={(e) => navTo(e, '#writing')}>Writing</a></li>
            <li><a href="#contact"    onClick={(e) => navTo(e, '#contact')}>Contact</a></li>
          </ul>

          {/* hamburger — always on top */}
          <button
            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(v => !v)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <span className="ham-line"></span>
            <span className="ham-line"></span>
            <span className="ham-line"></span>
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'show' : ''}`} onClick={close} />
      <div className={`mobile-nav-drawer ${isMenuOpen ? 'show' : ''}`}>
        <ul className="mobile-nav-list">
          {[
            ['#about',      'About'],
            ['#experience', 'Experience'],
            ['#projects',   'Projects'],
            ['#patent',     'Achievements'],
            ['#writing',    'Writing'],
            ['#contact',    'Contact'],
          ].map(([id, label], i) => (
            <li key={id} style={{ animationDelay: `${i * 0.04}s` }}>
              <a href={id} onClick={(e) => navTo(e, id)}>
                <span className="mn-num">0{i + 1}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-nav-footer">
          <a href="https://github.com/madhavanbalaji02"          target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/madhavanbalaji/"  target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
          <a href="https://medium.com/@madhavanbalaji02"          target="_blank" rel="noopener noreferrer"><i className="fab fa-medium"></i></a>
          <a href="mailto:madbala@iu.edu"                         target="_blank" rel="noopener noreferrer"><i className="fas fa-envelope"></i></a>
        </div>
      </div>
    </>
  );
};

export default Header;
