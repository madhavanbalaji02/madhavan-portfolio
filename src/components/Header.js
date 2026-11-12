import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTechNewsLink from './useTechNewsLink';
import useGlassLens from './useGlassLens';
import scrollToSection from '../scrollToSection';

const Header = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const openTechNews = useTechNewsLink();

  // A link straight to a section (e.g. madhavanbalaji.com/#projects): land with its
  // content just under the navbar, like the in-page links do
  useEffect(() => {
    const { hash } = window.location;
    if (!/^#[a-z-]+$/.test(hash) || !document.querySelector(hash)) return undefined;
    const id = setTimeout(() => scrollToSection(hash, 'auto'), 80);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const close = () => setIsMenuOpen(false);

  const navTo = (e, id) => {
    e?.preventDefault();
    close();
    selectSection(id);

    const doScroll = () => scrollToSection(id);

    if (location.pathname !== '/') {
      // On a project detail page: go home first, then scroll
      navigate('/');
      setTimeout(doScroll, 250);
    } else {
      setTimeout(doScroll, 10);
    }
  };

  const navLinks = [
    ['#about',      'About'],
    ['#experience', 'Experience'],
    ['#projects',   'Projects'],
    ['#patent',     'Patent'],
    ['#writing',    'Writing'],
    ['#contact',    'Contact'],
  ];

  // ── Current section (scroll-spy), shown by the navbar's glass lens in light mode ──
  // Clicking or dragging to a section selects it straight away and pauses the
  // scroll-spy until the smooth scroll ends, so the lens doesn't hop through every
  // section on the way.
  const [section, setSection] = useState(null);
  const spyLock = useRef({ on: false, timer: 0 });

  const readSection = () => {
    // The section links only show on wider screens; phones skip the work while scrolling
    if (window.location.pathname !== '/' || !window.matchMedia('(min-width: 769px)').matches) return null;
    const doc = document.documentElement;
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) return '#contact';
    let current = null;
    for (const [id] of navLinks) {
      const el = document.querySelector(id);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
    }
    return current;
  };

  const selectSection = (id) => {
    const lock = spyLock.current;
    setSection(id === '#home' ? null : id);
    lock.on = true;
    clearTimeout(lock.timer);
    lock.timer = setTimeout(() => { lock.on = false; setSection(readSection()); }, 700);
  };

  useEffect(() => {
    const lock = spyLock.current;
    let frame = 0;
    const update = () => { frame = 0; if (!lock.on) setSection(readSection()); };
    const onScroll = () => {
      if (lock.on) {
        // Still scrolling to the chosen section: release the lock once it settles
        clearTimeout(lock.timer);
        lock.timer = setTimeout(() => { lock.on = false; update(); }, 160);
        return;
      }
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Sections move when images and lazy content load, without any scroll
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (!lock.on && !frame) frame = requestAnimationFrame(update); }) : null;
    ro?.observe(document.body);
    return () => {
      ro?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(lock.timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const glass = true;   // the glass segmented control is used in both themes
  const lens = useGlassLens({
    keys: navLinks.map(([id]) => id),
    active: section,
    onSelect: (id) => navTo(null, id),
    enabled: glass,
  });

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-brand">
            <a href="#home" onClick={(e) => navTo(e, '#home')} className="navbar-logo-link">
              <img
                src={process.env.PUBLIC_URL + '/favicon.svg'}
                alt="Madhavan Balaji"
                className="navbar-favicon"
              />
            </a>
          </div>

          <ul className="navbar-nav desktop-nav">
            <li className="nav-seg-li">
              <div className="nav-seg glass-bar" {...lens.barProps}>
                {navLinks.map(([id, label]) => (
                  <a
                    key={id}
                    ref={lens.itemRef(id)}
                    href={id}
                    onClick={(e) => navTo(e, id)}
                    className={section === id ? 'active' : undefined}
                    aria-current={section === id ? 'location' : undefined}
                    draggable="false"
                  >
                    {label}
                  </a>
                ))}
                {glass && (
                  <span className="glass-lens" ref={lens.lensRef} aria-hidden="true">
                    <span className="glass-lens-content" ref={lens.contentRef}>
                      {navLinks.map(([id, label]) => (
                        <span key={id} ref={lens.ghostRef(id)} className="nav-seg-ghost glass-ghost">{label}</span>
                      ))}
                    </span>
                  </span>
                )}
              </div>
            </li>
            <li>
              <a href="/tech-news/" target="_blank" rel="noopener noreferrer" onClick={openTechNews} className="nav-tech-news-btn">
                Tech News ↗
              </a>
            </li>
            <li>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                <i className={theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun'}></i>
              </button>
            </li>
            <li>
              <a href="/resume.html" target="_blank" rel="noopener noreferrer" className="nav-resume-btn">
                Resume ↗
              </a>
            </li>
          </ul>

          <div className="mobile-nav-controls">
            <a href="/tech-news/" onClick={openTechNews} className="nav-tech-news-btn mobile-tech-news-btn">
              Tech News
            </a>
            <button className="theme-toggle mobile-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <i className={theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun'}></i>
            </button>

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
        </div>
      </nav>

      <div className={`mobile-nav-overlay ${isMenuOpen ? 'show' : ''}`} onClick={close} />
      <div className={`mobile-nav-drawer ${isMenuOpen ? 'show' : ''}`}>
        <ul className="mobile-nav-list">
          {navLinks.map(([id, label], i) => (
            <li key={id} style={{ animationDelay: `${i * 0.04}s` }}>
              <a href={id} onClick={(e) => navTo(e, id)}>
                <span className="mn-num">0{i + 1}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-nav-footer">
          <a href="https://github.com/madhavanbalaji02"         target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/madhavanbalaji/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
          <a href="https://medium.com/@madhavanbalaji02"         target="_blank" rel="noopener noreferrer" aria-label="Medium"><i className="fab fa-medium"></i></a>
          <a href="mailto:madhavanbalaji02@gmail.com" aria-label="Email"><i className="fas fa-envelope"></i></a>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <i className={theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun'}></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
