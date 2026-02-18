import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook, faUserPlus, faSignInAlt,
  faHome, faBookOpen, faShoppingCart,
  faHistory, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { getCart } from '../services/cartApi';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeLink, setActiveLink] = useState('home');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  const loadCartCount = async () => {
    if (token) {
      try {
        const items = await getCart(token);
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch (error) {
        console.error('Failed to load cart count', error);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();
    const handleCartUpdate = () => loadCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleNavClick = (link) => {
    setActiveLink(link);
    setMobileMenuOpen(false);
    if (link === 'login') navigate('/login');
    else if (link === 'signup') navigate('/signup');
    else navigate(`/${link === 'home' ? '' : link}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setActiveLink('home');
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="booknest-header">
      <div className="header-container">

        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo-link" onClick={() => setActiveLink('home')}>
            <FontAwesomeIcon icon={faBook} className="logo-icon" />
            <h1 className="logo-text">Book<span>Nest</span></h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <ul className="nav-menu">
            <li className="nav-item">
              <button className={`nav-link ${activeLink === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
                <FontAwesomeIcon icon={faHome} /> Home
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeLink === 'books' ? 'active' : ''}`} onClick={() => handleNavClick('books')}>
                <FontAwesomeIcon icon={faBookOpen} /> Books
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeLink === 'cart' ? 'active' : ''}`} onClick={() => handleNavClick('cart')}>
                <FontAwesomeIcon icon={faShoppingCart} /> Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </li>
            {token && (
              <li className="nav-item">
                <button className={`nav-link ${activeLink === 'orders' ? 'active' : ''}`} onClick={() => handleNavClick('orders')}>
                  <FontAwesomeIcon icon={faHistory} /> My Orders
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {!token ? (
            <>
              <button className="btn btn-signup" onClick={() => handleNavClick('signup')}>
                <FontAwesomeIcon icon={faUserPlus} /> Sign Up
              </button>
              <button className="btn btn-login" onClick={() => handleNavClick('login')}>
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </button>
            </>
          ) : (
            <button className="btn btn-logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`nav-mobile ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="nav-menu">
          <li>
            <button className={activeLink === 'home' ? 'active' : ''} onClick={() => handleNavClick('home')}>
              <FontAwesomeIcon icon={faHome} /> Home
            </button>
          </li>
          <li>
            <button className={activeLink === 'books' ? 'active' : ''} onClick={() => handleNavClick('books')}>
              <FontAwesomeIcon icon={faBookOpen} /> Books
            </button>
          </li>
          <li>
            <button className={activeLink === 'cart' ? 'active' : ''} onClick={() => handleNavClick('cart')}>
              <FontAwesomeIcon icon={faShoppingCart} /> Cart {cartCount > 0 && `(${cartCount})`}
            </button>
          </li>
          {token && (
            <li>
              <button className={activeLink === 'orders' ? 'active' : ''} onClick={() => handleNavClick('orders')}>
                <FontAwesomeIcon icon={faHistory} /> My Orders
              </button>
            </li>
          )}
          {!token ? (
            <>
              <li>
                <button onClick={() => handleNavClick('signup')}>
                  <FontAwesomeIcon icon={faUserPlus} /> Sign Up
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('login')}>
                  <FontAwesomeIcon icon={faSignInAlt} /> Login
                </button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;