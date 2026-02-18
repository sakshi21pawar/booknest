import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookFormModal from './BookFormModal';
import './AdminDashboard.css';
import { 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaBook, 
  FaDollarSign, 
  FaTags, 
  FaBoxes,
  FaSearch,
  FaUsers,
  FaShoppingCart,
  FaEye
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      alert('Book deleted successfully!');
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete book. Please try again.');
    }
  };

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(books.map(book => book.category))];

  // Calculate stats
  const totalBooks = books.length;
  const totalStock = books.reduce((sum, book) => sum + book.stock, 0);
  const lowStock = books.filter(book => book.stock <= 5).length;
  const totalValue = books.reduce((sum, book) => sum + (book.price * book.stock), 0).toFixed(2);

  // Helper function to check if stock is low
  const isLowStock = (stock) => stock <= 5;

  return (
    <div className="admin-dashboard">
      <div className="header-section">
        <h1>Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBook />
          </div>
          <div className="stat-info">
            <h3>Total Books</h3>
            <div className="stat-number">{totalBooks}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxes />
          </div>
          <div className="stat-info">
            <h3>Total Stock</h3>
            <div className="stat-number">{totalStock}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-info">
            <h3>Low Stock</h3>
            <div className="stat-number">{lowStock}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>Inventory Value</h3>
            <div className="stat-number">${totalValue}</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="add-book-btn" 
          onClick={() => { 
            setBookToEdit(null); 
            setIsModalOpen(true); 
          }}
        >
          <FaPlus /> Add New Book
        </button>
      </div>

      {/* Category Filter Chips (Mobile) */}
      <div className="filter-chips">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-chip ${filterCategory === category ? 'active' : ''}`}
            onClick={() => setFilterCategory(category)}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBooks.length === 0 && (
        <div className="empty-state">
          <FaBook />
          <p>{searchTerm ? 'No books match your search' : 'No books found. Add your first book!'}</p>
          {!searchTerm && (
            <button 
              className="add-book-btn" 
              onClick={() => { 
                setBookToEdit(null); 
                setIsModalOpen(true); 
              }}
            >
              <FaPlus /> Add New Book
            </button>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      {!loading && filteredBooks.length > 0 && (
        <div className="mobile-book-cards">
          {filteredBooks.map(book => (
            <div key={book.id} className="mobile-book-card">
              <div className="mobile-card-header">
                <div className="mobile-title-section">
                  <h3>{book.title}</h3>
                  <div className="mobile-author">by {book.author}</div>
                </div>
                <span className="mobile-category-badge">{book.category}</span>
              </div>
              
              <div className="mobile-card-body">
                <div className="mobile-info-row">
                  <div className="mobile-info-item">
                    <FaDollarSign /> 
                    <span className="mobile-price">{parseFloat(book.price).toFixed(2)}</span>
                  </div>
                  <div className="mobile-info-item">
                    <FaBoxes />
                    <span className="mobile-stock">
                      {book.stock} in stock
                      {isLowStock(book.stock) && (
                        <span className="low-stock-badge">Low</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mobile-card-footer">
                <button 
                  className="mobile-action-btn mobile-edit-btn"
                  onClick={() => { 
                    setBookToEdit(book); 
                    setIsModalOpen(true); 
                  }}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className="mobile-action-btn mobile-delete-btn"
                  onClick={() => handleDelete(book.id, book.title)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table View */}
      {!loading && filteredBooks.length > 0 && (
        <div className="books-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id}>
                  <td title={book.title}>
                    {book.title.length > 30 ? `${book.title.substring(0, 30)}...` : book.title}
                  </td>
                  <td>{book.author}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaDollarSign style={{ fontSize: '0.8rem', color: 'var(--deep-teal)' }} />
                      {parseFloat(book.price).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaTags style={{ fontSize: '0.7rem', color: 'var(--gold)' }} />
                      {book.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      color: isLowStock(book.stock) ? '#e76f51' : 'inherit',
                      fontWeight: isLowStock(book.stock) ? '600' : '400'
                    }}>
                      <FaBoxes style={{ fontSize: '0.8rem' }} />
                      {book.stock}
                      {isLowStock(book.stock) && (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          background: 'rgba(231, 111, 81, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '12px',
                          marginLeft: '4px'
                        }}>
                          Low
                        </span>
                      )}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="edit-btn" 
                      onClick={() => { 
                        setBookToEdit(book); 
                        setIsModalOpen(true); 
                      }}
                      title="Edit book"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(book.id, book.title)}
                      title="Delete book"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => { 
          setIsModalOpen(false); 
          setBookToEdit(null); 
        }}
        onBookAdded={fetchBooks}
        bookToEdit={bookToEdit}
      />
    </div>
  );
};

export default AdminDashboard;