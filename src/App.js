import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useSeo, DEFAULT_SEO } from './seo';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Patent from './components/Patent';
import Writing from './components/Writing';
import Contact from './components/Contact';
import TechNewsTeaser from './components/TechNewsTeaser';
import Footer from './components/Footer';
import Loader from './components/Loader';
import BackToTop from './components/BackToTop';
import Sky from './components/Sky';
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const TechNewsPage  = lazy(() => import('./components/TechNewsPage'));

function MainPage({ theme, toggleTheme }) {
  useSeo(DEFAULT_SEO);
  return (
    <>
      <div className="App">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Patent />
        <Writing />
        <Contact />
        <TechNewsTeaser />
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}

function NotFound() {
  useSeo({ title: 'Page not found | Madhavan Balaji', path: '/404', noindex: true });
  return (
    <main className="not-found">
      <span className="section-tag">404</span>
      <h1 className="not-found-title">This page doesn't exist.</h1>
      <p className="not-found-text">The link may be broken, or the page may have moved.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </main>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.classList.add('page-transition');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <BrowserRouter>
      <Sky />
      <Routes>
        <Route path="/" element={<MainPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/project/:projectId" element={<Suspense fallback={<Loader />}><ProjectDetail theme={theme} toggleTheme={toggleTheme} /></Suspense>} />
        <Route path="/tech-news" element={<Suspense fallback={<Loader />}><TechNewsPage theme={theme} toggleTheme={toggleTheme} /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
