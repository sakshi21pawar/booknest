import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './BooksList.css';
import { addToCart } from '../services/cartApi';
import axios from 'axios';
import API_URL from '../config';

import { 
  FaBookOpen, FaBriefcase, FaDragon, FaBrain, FaBookReader,
  FaGraduationCap, FaHeart, FaUserFriends, FaStar,
  FaShoppingCart, FaEye
} from 'react-icons/fa';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  const categoryData = [
    { name: 'All',       icon: <FaBookOpen /> },
    { name: 'Business',  icon: <FaBriefcase /> },
    { name: 'Fantasy',   icon: <FaDragon /> },
    { name: 'Self-Help', icon: <FaBrain /> },
    { name: 'Fiction',   icon: <FaBookReader /> },
    { name: 'Education', icon: <FaGraduationCap /> },
    { name: 'Romance',   icon: <FaHeart /> },
    { name: 'Biography', icon: <FaUserFriends /> }
  ];

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/books`, {
        params: { category: category === 'All' ? '' : category }
      });

      let booksData = res.data.map(b => ({
        ...b,
        rating: Number(b.rating),
        price: Number(b.price)
      }));

      switch (sortBy) {
        case 'priceLow':  booksData.sort((a, b) => a.price - b.price); break;
        case 'priceHigh': booksData.sort((a, b) => b.price - a.price); break;
        case 'rating':    booksData.sort((a, b) => b.rating - a.rating); break;
        default: break;
      }

      setBooks(booksData);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
    setLoading(false);
  }, [category, sortBy]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  useEffect(() => {
    const handleCartUpdate = () => fetchBooks();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [fetchBooks]);

  const handleAddToCart = async (book, e) => {
    e.stopPropagation();
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login first!'); return; }
    try {
      const res = await addToCart(book.id, token);
      if (res.ok) {
        alert(`"${book.title}" added to cart!`);
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        alert('Failed to add to cart');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  const getCategoryCount = (categoryName) => {
    if (categoryName === 'All') return books.length;
    return books.filter(b => b.category === categoryName).length;
  };

  return (
    <div className="books-list-page">
      <section className="books-hero">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"></span>
            Curated Collection
          </div>
          <h1 className="hero-title">
            Discover Your Next<br /><span>Great Read</span>
          </h1>
          <p className="hero-subtitle">
            Explore our carefully curated collection of books that inspire, educate, and entertain
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">{books.length}+</span>
              <span className="hero-stat-label">Books Available</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">8</span>
              <span className="hero-stat-label">Categories</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">★ 4.8</span>
              <span className="hero-stat-label">Avg. Rating</span>
            </div>
          </div>
        </div>
      </section>

      <div className="books-container">
        <section className="category-section">
          <div className="section-header">
            <div className="section-title-group">
              <h2 className="category-title">Browse by Category</h2>
              <p className="category-subtitle">Find books that match your interests</p>
            </div>
          </div>
          <div className="category-grid">
            {categoryData.map((cat) => (
              <button
                key={cat.name}
                className={`category-card ${category === cat.name ? 'active' : ''}`}
                onClick={() => setCategory(cat.name)}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-content">
                  <h3 className="category-name">{cat.name}</h3>
                  <span className="category-count">{getCategoryCount(cat.name)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="books-header">
          <div className="books-count">
            <h2>{category === 'All' ? 'All Books' : `${category} Books`}</h2>
            <p>{books.length} {books.length === 1 ? 'book' : 'books'} available</p>
          </div>
          <div className="sort-options">
            <span className="sort-label">Sort by:</span>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">Popular</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading books...</p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <div className="books-grid">
            {books.map((book) => (
              <article key={book.id} className="book-card">
                <div className="book-image-wrapper">
                  <img
                    src={book.image_url}
                    alt={`Cover of ${book.title}`}
                    className="book-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  {book.category && <span className="book-category-badge">{book.category}</span>}
                  <div className="book-overlay">
                    <Link to={`/books/${book.id}`} className="view-book-btn">
                      <FaEye />
                      <span>View Details</span>
                    </Link>
                  </div>
                  <button className="quick-cart-btn" onClick={(e) => handleAddToCart(book, e)}>
                    <FaShoppingCart />
                  </button>
                </div>
                <div className="book-info">
                  <header className="book-header">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                  </header>
                  <footer className="book-meta">
                    <div className="book-rating">
                      <FaStar className="star-icon" />
                      <span>{book.rating.toFixed(1)}</span>
                    </div>
                    <div className="book-price">${book.price.toFixed(2)}</div>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><FaBookOpen /></div>
            <h3>No books found</h3>
            <p>Try exploring other categories!</p>
            <button className="reset-filter-btn" onClick={() => setCategory('All')}>Show All Books</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksList;