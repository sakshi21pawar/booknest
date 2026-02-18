import React from "react";
import { Link } from "react-router-dom";
import {
  FaStar, FaShippingFast, FaHandHoldingHeart, FaExchangeAlt, FaAward,
  FaBookOpen, FaRocket, FaDragon, FaSearch, FaHeart, FaUserTie,
  FaPenNib, FaChevronRight
} from "react-icons/fa";
import './HomePage.css';

const featuredBooks = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 12.99, image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.5, category: "Classic" },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 14.99, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.8, category: "Self-Help" },
  { id: 3, title: "The Silent Patient", author: "Alex Michaelides", price: 11.99, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.3, category: "Thriller" },
  { id: 4, title: "Project Hail Mary", author: "Andy Weir", price: 16.99, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", rating: 4.9, category: "Sci-Fi" },
];

const categories = [
  { name: "Fiction",          icon: <FaBookOpen />,  count: 245 },
  { name: "Science Fiction",  icon: <FaRocket />,    count: 189 },
  { name: "Fantasy",          icon: <FaDragon />,    count: 167 },
  { name: "Mystery",          icon: <FaSearch />,    count: 156 },
  { name: "Romance",          icon: <FaHeart />,     count: 234 },
  { name: "Biography",        icon: <FaUserTie />,   count: 145 },
  { name: "Poetry",           icon: <FaPenNib />,    count: 98  },
  { name: "Business",         icon: "📈",             count: 178 },
];

const testimonials = [
  { id: 1, name: "Dr. Sarah Johnson",   role: "Literature Professor",    rating: 5, text: "The curated selection at BookNest is exceptional. Every book feels handpicked with care and attention to literary quality." },
  { id: 2, name: "Michael Rodriguez",   role: "CEO, Tech Innovations",   rating: 5, text: "Our corporate library transformed overnight. BookNest's recommendations are consistently excellent and professionally relevant." },
  { id: 3, name: "Emily Chen",          role: "Award-winning Author",    rating: 4, text: "As an author, I appreciate how BookNest supports the literary community while offering readers an outstanding experience." },
];

const HomePage = () => {
  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="home-hero-minimal">
        <div className="hero-container">
          <div className="hero-content-minimal">
            <div className="hero-eyebrow">
              <span className="hero-dot"></span>
              Curated Book Collection
            </div>
            <h1 className="hero-title-minimal">BookNest</h1>
            <p className="hero-tagline">Where stories find their readers</p>
            <p className="hero-description">
              A carefully curated collection of literary treasures,
              thoughtfully selected for discerning readers.
            </p>
            <div className="hero-buttons-minimal">
              <Link to="/books" className="hero-btn-primary">
                Browse Collection <FaChevronRight className="btn-arrow" />
              </Link>
              <Link to="/register" className="hero-btn-secondary">
                Join Our Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Why BookNest</span>
            <h2 className="section-title">The BookNest Difference</h2>
            <p className="section-subtitle">Experience reading like never before</p>
          </div>
          <div className="features-grid">
            {[
              { icon: <FaShippingFast />, title: "Free Shipping",    desc: "Free delivery on all orders over $25. Fast and reliable service." },
              { icon: <FaHandHoldingHeart />, title: "Expert Curation", desc: "Every book handpicked by our team of literary specialists." },
              { icon: <FaExchangeAlt />, title: "Easy Returns",     desc: "30-day return policy for complete peace of mind." },
              { icon: <FaAward />,       title: "Award Winning",    desc: "Recognized for excellence in literary curation." },
            ].map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED BOOKS ── */}
      <section className="featured-books-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Handpicked For You</span>
            <h2 className="section-title">Featured Books</h2>
            <p className="section-subtitle">Discover our current favorites</p>
          </div>
          <div className="books-grid">
            {featuredBooks.map(book => (
              <div key={book.id} className="featured-book-card">
                <div className="book-image-container">
                  <img src={book.image} alt={book.title} className="book-image" />
                </div>
                <div className="book-content">
                  <span className="book-category">{book.category}</span>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(book.rating) ? "star-filled" : "star-empty"} />
                    ))}
                    <span className="rating-value">{book.rating}</span>
                  </div>
                  <div className="book-footer">
                    <div className="book-price">${book.price.toFixed(2)}</div>
                    <Link to={`/books/${book.id}`} className="view-details-btn">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/books" className="view-all-btn">
              View All Books <FaChevronRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Explore Genres</span>
            <h2 className="section-title">Browse Categories</h2>
            <p className="section-subtitle">Find your next favorite read by genre</p>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link to={`/books?category=${cat.name}`} key={cat.name} className="category-card">
                <div className="category-icon">{cat.icon}</div>
                <div className="category-content">
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-count">{cat.count} titles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Reader Reviews</span>
            <h2 className="section-title">What Readers Say</h2>
            <p className="section-subtitle">Join our community of book lovers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < t.rating ? "star-filled" : "star-empty"} />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <h4 className="author-name">{t.name}</h4>
                  <p className="author-role">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Explore?</h2>
          <p className="cta-text">
            Start your literary journey with BookNest today.
            Discover books that inspire, challenge, and entertain.
          </p>
          <div className="cta-buttons">
            <Link to="/books" className="cta-btn primary">Start Browsing</Link>
            <Link to="/register" className="cta-btn secondary">Create Account</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;