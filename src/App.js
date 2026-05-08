import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Patent from './components/Patent';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';
import BackToTop from './components/BackToTop';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add page transition class
    document.body.classList.add('page-transition');

    // Performance optimization: Preload critical resources
    const preloadLinks = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: true }
    ];

    preloadLinks.forEach(link => {
      const linkElement = document.createElement('link');
      Object.keys(link).forEach(key => {
        linkElement[key] = link[key];
      });
      document.head.appendChild(linkElement);
    });
  }, []);

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
        <Contact />
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}

export default App;

