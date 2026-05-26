import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const TechNewsPage  = lazy(() => import('./components/TechNewsPage'));

function MainPage({ loading, theme, toggleTheme }) {
  return (
    <>
      {loading && <Loader />}
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

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage loading={loading} theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/project/:projectId" element={<Suspense fallback={<Loader />}><ProjectDetail theme={theme} toggleTheme={toggleTheme} /></Suspense>} />
        <Route path="/tech-news" element={<Suspense fallback={<Loader />}><TechNewsPage /></Suspense>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
