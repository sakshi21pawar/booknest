import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookFormModal.css';

const BookFormModal = ({ isOpen, onClose, onBookAdded, bookToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    rating: '',
    category: '',
    image_url: '',
    stock: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Pre-fill form if editing
  useEffect(() => {
    if (bookToEdit) {
      setFormData(bookToEdit);
    } else {
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        rating: '',
        category: '',
        image_url: '',
        stock: ''
      });
    }
    setTouched({});
  }, [bookToEdit]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    const requiredFields = ['title', 'author', 'description', 'price', 'rating', 'category', 'stock'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      if (bookToEdit) {
        // Edit existing book
        await axios.put(`http://localhost:5000/api/books/${bookToEdit.id}`, formData);
        alert('Book updated successfully!');
      } else {
        // Add new book
        await axios.post('http://localhost:5000/api/books', formData);
        alert('Book added successfully!');
      }
      onBookAdded(); // Refresh list
      onClose();     // Close modal
    } catch (err) {
      console.error(err);
      alert('Failed to save book. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">
          {bookToEdit ? 'Edit Book' : 'Add New Book'}
        </h2>
        
        <form className="book-form" onSubmit={handleSubmit} noValidate>
          <input
            name="title"
            placeholder="Book Title *"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoFocus
            className={touched.title && !formData.title ? 'error' : ''}
          />
          
          <input
            name="author"
            placeholder="Author Name *"
            value={formData.author}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={touched.author && !formData.author ? 'error' : ''}
          />
          
          <input
            name="description"
            placeholder="Book Description *"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={touched.description && !formData.description ? 'error' : ''}
          />
          
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Price ($) *"
            value={formData.price}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={touched.price && !formData.price ? 'error' : ''}
          />
          
          <input
            name="rating"
            type="number"
            step="0.1"
            max="5"
            min="0"
            placeholder="Rating (0-5) *"
            value={formData.rating}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={touched.rating && !formData.rating ? 'error' : ''}
          />
          
          <input
            name="category"
            placeholder="Category *"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            list="categories"
            className={touched.category && !formData.category ? 'error' : ''}
          />
          <datalist id="categories">
            <option value="Fiction" />
            <option value="Non-Fiction" />
            <option value="Science" />
            <option value="Technology" />
            <option value="History" />
            <option value="Biography" />
          </datalist>
          
          <input
            name="image_url"
            type="url"
            placeholder="Image URL (optional)"
            value={formData.image_url}
            onChange={handleChange}
          />
          
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="Stock Quantity *"
            value={formData.stock}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={touched.stock && !formData.stock ? 'error' : ''}
          />

          <div className="modal-buttons">
            <button 
              type="button" 
              className="close-btn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={isSubmitting ? 'loading' : ''}
            >
              {isSubmitting ? 'Saving...' : (bookToEdit ? 'Update Book' : 'Add Book')}
            </button>
          </div>

          <div className="input-hint">* Required fields</div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;