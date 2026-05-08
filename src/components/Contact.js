import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mailtoLink = `mailto:madbala@iu.edu?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;

    setSubmitStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => {
      setSubmitStatus('');
    }, 3000);
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-subtitle">I'm always open to discussing new projects, creative ideas, or opportunities</p>
        </div>
        <div className="contact-wrapper">
          <div className="contact-info fade-in-up">
            <div className="availability-badge">
              <span className="availability-dot"></span>
              Available for opportunities
            </div>
            <h3>Let's Connect</h3>
            <p>Feel free to reach out through any of these channels. I typically respond within 24 hours.</p>
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <a href="mailto:madbala@iu.edu" target="_blank" rel="noopener noreferrer">madbala@iu.edu</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fab fa-linkedin"></i>
                </div>
                <div className="contact-details">
                  <h4>LinkedIn</h4>
                  <a href="https://www.linkedin.com/in/madhavanbalaji/" target="_blank" rel="noopener noreferrer">Connect with me</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fab fa-github"></i>
                </div>
                <div className="contact-details">
                  <h4>GitHub</h4>
                  <a href="https://github.com/madhavanbalaji02" target="_blank" rel="noopener noreferrer">View my code</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-file-pdf"></i>
                </div>
                <div className="contact-details">
                  <h4>Resume</h4>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Download PDF</a>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form-wrapper fade-in-up">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={submitStatus === 'success' ? { background: '#10b981' } : {}}
              >
                {submitStatus === 'success' ? (
                  <>
                    <i className="fas fa-check"></i>
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <i className="fas fa-paper-plane"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

