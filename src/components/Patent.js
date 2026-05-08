import React from 'react';

const Patent = () => {
  return (
    <section id="patent" className="section patent-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Innovation</span>
          <h2 className="section-title">Patent & Research</h2>
          <p className="section-subtitle">Breakthrough solutions making a real impact</p>
        </div>
        <div className="patent fade-in-up">
          <div className="patent-image-wrapper">
            <a
              href="https://github.com/madhavanbalaji02/madhavan-portfolio/blob/main/patent.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="patent-pdf-link"
            >
              <iframe
                src="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/madhavanbalaji02/madhavan-portfolio/main/patent.pdf&embedded=true"
                title="Patent Document"
                className="patent-pdf-embed"
                frameBorder="0"
              />
              <div className="patent-pdf-overlay">
                <i className="fas fa-external-link-alt"></i>
                <span>Open Full PDF</span>
              </div>
            </a>
            <div className="patent-badge">
              <i className="fas fa-certificate"></i>
              <span>Patent Filed</span>
            </div>
          </div>
          <div className="patent-details">
            <h3>Caremate - Integrated Elderly Support System</h3>
            <p className="patent-description">
              A comprehensive IoT-based solution designed to enhance the quality of life for elderly individuals 
              through intelligent health monitoring, emotion detection, and emotional support systems.
            </p>
            <div className="patent-features">
              <div className="feature-item">
                <i className="fas fa-heartbeat"></i>
                <span>Real-time Health Monitoring</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-smile"></i>
                <span>AI-Powered Emotion Detection</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-robot"></i>
                <span>Intelligent Support Chatbot</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-pills"></i>
                <span>Automated Medication Management</span>
              </div>
            </div>
            <div className="patent-actions">
              <a href="https://github.com/madhavanbalaji02/madhavan-portfolio/blob/main/patent.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <i className="fas fa-file-pdf"></i>
                <span>View Patent Document</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Patent;

