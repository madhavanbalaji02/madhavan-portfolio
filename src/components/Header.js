import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <>


      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-brand">
            <a href="#home">MB</a>
          </div>
          <ul className={`navbar-nav ${isMenuOpen ? 'show' : ''}`} id="navbar-nav">
            <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a></li>
            <li><a href="#experience" onClick={(e) => handleNavClick(e, '#experience')}>Experience</a></li>
            <li><a href="#projects" onClick={(e) => handleNavClick(e, '#projects')}>Projects</a></li>
            <li><a href="#patent" onClick={(e) => handleNavClick(e, '#patent')}>Achievements</a></li>
            <li><a href="#writing" onClick={(e) => handleNavClick(e, '#writing')}>Writing</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a></li>
          </ul>
          <button
            className="hamburger"
            id="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            &#9776;
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;

