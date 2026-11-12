import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTechNewsLink from './useTechNewsLink';
import useGlassLens from './useGlassLens';
import ThemeToggle from './ThemeToggle';
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

  // While the menu is open: the page stays still, Escape closes it, the sheet starts
  // just under the navbar, and the section you were reading is marked.
  const [menuSection, setMenuSection] = useState(null);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('menu-open', isMenuOpen);
    if (!isMenuOpen) return undefined;
    const nav = document.querySelector('.navbar');
    const navBottom = nav ? nav.getBoundingClientRect().bottom : 72;
    root.style.setProperty('--mnav-top', `${Math.round(navBottom)}px`);
    let current = null;
    document.querySelectorAll('main .section[id], .section[id]').forEach((el) => {
      if (navLinks.some(([id]) => id === `#${el.id}`) && el.getBoundingClientRect().top <= navBottom + 120) current = `#${el.id}`;
    });
    setMenuSection(current);
    // Lock scrolling on <html>, not <body>: <html> clips horizontally, so a hidden
    // <body> would become its own scroller and the sticky navbar would jump away.
    root.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setIsMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = '';
      root.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (window.location.pathname !== '/') return null;
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

  // Phones: the same glass, as an iOS-style tab bar floating at the bottom of the screen
  const tabs = [
    ['#about',      'About',    'fa-solid fa-user'],
    ['#experience', 'Work',     'fa-solid fa-briefcase'],
    ['#projects',   'Projects', 'fa-solid fa-layer-group'],
    ['#patent',     'Patent',   'fa-solid fa-lightbulb'],
    ['#writing',    'Writing',  'fa-solid fa-pen-nib'],
    ['#contact',    'Contact',  'fa-solid fa-paper-plane'],
  ];
  const fullName = Object.fromEntries(navLinks);
  const tabLens = useGlassLens({
    keys: tabs.map(([id]) => id),
    active: section,
    onSelect: (id) => navTo(null, id),
    enabled: true,
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
                {glass && lens.hapticLayer}
              </div>
            </li>
            <li>
              <a href="/tech-news/" target="_blank" rel="noopener noreferrer" onClick={openTechNews} className="nav-tech-news-btn">
                Tech News ↗
              </a>
            </li>
            <li>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
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
            <ThemeToggle className="theme-toggle mobile-theme-toggle" theme={theme} toggleTheme={toggleTheme} />

            <button
              className={`hamburger ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(v => !v)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="ham-line"></span>
              <span className="ham-line"></span>
              <span className="ham-line"></span>
            </button>
          </div>
        </div>
      </nav>

      <nav className="ptab-wrap" aria-label="Sections">
        <div className="ptab glass-bar" {...tabLens.barProps}>
          {tabs.map(([id, label, icon]) => (
            <a
              key={id}
              ref={tabLens.itemRef(id)}
              href={id}
              onClick={(e) => navTo(e, id)}
              className={section === id ? 'active' : undefined}
              aria-current={section === id ? 'location' : undefined}
              aria-label={fullName[id]}
              draggable="false"
            >
              <i className={icon} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
          <span className="glass-lens" ref={tabLens.lensRef} aria-hidden="true">
            <span className="glass-lens-content" ref={tabLens.contentRef}>
              {tabs.map(([id, label, icon]) => (
                <span key={id} ref={tabLens.ghostRef(id)} className="ptab-ghost glass-ghost">
                  <i className={icon} />
                  <span>{label}</span>
                </span>
              ))}
            </span>
          </span>
          {tabLens.hapticLayer}
        </div>
      </nav>

      {/* Phone menu: a full-screen frosted sheet under the navbar (the ☰ becomes ✕),
          in the manner of Apple's own mobile menu */}
      <div
        id="mobile-menu"
        className={`mnav ${isMenuOpen ? 'show' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!isMenuOpen}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <nav className="mnav-inner" aria-label="Sections">
          <ul className="mnav-list">
            {navLinks.map(([id, label], i) => (
              <li key={id} className="mnav-item" style={{ '--i': i }}>
                <a
                  href={id}
                  onClick={(e) => navTo(e, id)}
                  className={menuSection === id ? 'is-current' : undefined}
                  aria-current={menuSection === id ? 'location' : undefined}
                >
                  <span>{label}</span>
                  <i className="fas fa-chevron-right" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mnav-group mnav-item" style={{ '--i': navLinks.length }}>
            <a href="/resume.html" target="_blank" rel="noopener noreferrer" onClick={close}>
              <span className="mnav-ic"><i className="fas fa-file-lines" aria-hidden="true" /></span>
              <span className="mnav-gl">Résumé</span>
              <i className="fas fa-arrow-up-right-from-square mnav-trail" aria-hidden="true" />
            </a>
            <a href="mailto:madhavanbalaji02@gmail.com" onClick={close}>
              <span className="mnav-ic"><i className="fas fa-envelope" aria-hidden="true" /></span>
              <span className="mnav-gl">Email me</span>
              <i className="fas fa-chevron-right mnav-trail" aria-hidden="true" />
            </a>
          </div>

          <div className="mnav-social mnav-item" style={{ '--i': navLinks.length + 1 }}>
            <a href="https://github.com/madhavanbalaji02"         target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
            <a href="https://www.linkedin.com/in/madhavanbalaji/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="https://medium.com/@madhavanbalaji02"         target="_blank" rel="noopener noreferrer" aria-label="Medium"><i className="fab fa-medium"></i></a>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
