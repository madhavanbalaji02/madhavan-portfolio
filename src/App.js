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
import Footer from './components/Footer';
import Loader from './components/Loader';
import BackToTop from './components/BackToTop';
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));

function MainPage({ loading }) {
  return (
    <>
      {loading && <Loader />}
      <div className="App">
        <Header />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Patent />
        <Writing />
        <Contact />
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.classList.add('page-transition');
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage loading={loading} />} />
        <Route path="/project/:projectId" element={<Suspense fallback={<Loader />}><ProjectDetail /></Suspense>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
