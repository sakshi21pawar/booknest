import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram, faFacebook, faGoodreads } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thanks for subscribing with ${email}!`);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">

          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <FontAwesomeIcon icon={faBook} className="footer-logo-icon" />
              <h2 className="footer-logo-text">Book<span>Nest</span></h2>
            </Link>
            <p className="footer-tagline">
              A carefully curated collection of literary treasures,
              thoughtfully selected for discerning readers who love great stories.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="social-link" aria-label="Goodreads">
                <FontAwesomeIcon icon={faGoodreads} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Explore</h3>
            <ul className="footer-links">
              <li><Link to="/"       className="footer-link">Home</Link></li>
              <li><Link to="/books"  className="footer-link">All Books</Link></li>
              <li><Link to="/cart"   className="footer-link">My Cart</Link></li>
              <li><Link to="/orders" className="footer-link">My Orders</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3 className="footer-title">Stay Updated</h3>
            <p className="footer-tagline" style={{ marginBottom: '14px' }}>
              Get new arrivals and reading recommendations.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <div className="form-group">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} <span>BookNest</span>. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="#" className="legal-link">Privacy Policy</a>
            <a href="#" className="legal-link">Terms of Service</a>
            <a href="#" className="legal-link">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;