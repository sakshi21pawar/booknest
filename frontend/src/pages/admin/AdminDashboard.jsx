import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookFormModal from './BookFormModal';
import API_URL from '../../config';
import './AdminDashboard.css';
import { FaTrash, FaEdit, FaPlus, FaBook, FaDollarSign, FaTags, FaBoxes, FaSearch, FaShoppingCart } from 'react-icons/fa';

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
      const res = await axios.get(`${API_URL}/api/books`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await axios.delete(`${API_URL}/api/books/${id}`);
      alert('Book deleted successfully!');
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete book.');
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(books.map(book => book.category))];
  const totalBooks = books.length;
  const totalStock = books.reduce((sum, book) => sum + book.stock, 0);
  const lowStock = books.filter(book => book.stock <= 5).length;
  const totalValue = books.reduce((sum, book) => sum + (book.price * book.stock), 0).toFixed(2);
  const isLowStock = (stock) => stock <= 5;

  return (
    <div className="admin-dashboard">
      <div className="header-section"><h1>Admin Dashboard</h1></div>

      <div className="stats-cards">
        <div className="stat-card"><div className="stat-icon"><FaBook /></div><div className="stat-info"><h3>Total Books</h3><div className="stat-number">{totalBooks}</div></div></div>
        <div className="stat-card"><div className="stat-icon"><FaBoxes /></div><div className="stat-info"><h3>Total Stock</h3><div className="stat-number">{totalStock}</div></div></div>
        <div className="stat-card"><div className="stat-icon"><FaShoppingCart /></div><div className="stat-info"><h3>Low Stock</h3><div className="stat-number">{lowStock}</div></div></div>
        <div className="stat-card"><div className="stat-icon"><FaDollarSign /></div><div className="stat-info"><h3>Inventory Value</h3><div className="stat-number">${totalValue}</div></div></div>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search books..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button className="add-book-btn" onClick={() => { setBookToEdit(null); setIsModalOpen(true); }}>
          <FaPlus /> Add New Book
        </button>
      </div>

      <div className="filter-chips">
        {categories.map(category => (
          <button key={category} className={`filter-chip ${filterCategory === category ? 'active' : ''}`} onClick={() => setFilterCategory(category)}>
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>

      {loading && <div className="loading-state"><div className="spinner"></div><p>Loading books...</p></div>}

      {!loading && filteredBooks.length === 0 && (
        <div className="empty-state">
          <FaBook />
          <p>{searchTerm ? 'No books match your search' : 'No books found.'}</p>
        </div>
      )}

      {!loading && filteredBooks.length > 0 && (
        <div className="books-table">
          <table>
            <thead>
              <tr><th>Title</th><th>Author</th><th>Price</th><th>Category</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id}>
                  <td>{book.title.length > 30 ? `${book.title.substring(0, 30)}...` : book.title}</td>
                  <td>{book.author}</td>
                  <td>${parseFloat(book.price).toFixed(2)}</td>
                  <td>{book.category}</td>
                  <td style={{ color: isLowStock(book.stock) ? '#e76f51' : 'inherit' }}>{book.stock}{isLowStock(book.stock) && ' ⚠️'}</td>
                  <td>
                    <button className="edit-btn" onClick={() => { setBookToEdit(book); setIsModalOpen(true); }}><FaEdit /> Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(book.id, book.title)}><FaTrash /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BookFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setBookToEdit(null); }} onBookAdded={fetchBooks} bookToEdit={bookToEdit} />
    </div>
  );
};

export default AdminDashboard;