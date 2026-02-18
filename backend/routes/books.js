const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ add this

// =======================
// GET ALL BOOKS
// =======================
router.get('/', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM books';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// =======================
// GET BOOK BY ID + REVIEWS
// =======================
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const bookQuery = `
    SELECT id, title, author, description, price, rating, category, image_url, stock, genre, pages, language, publisher
    FROM books
    WHERE id = ?
  `;

  db.query(bookQuery, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = results[0];

    const reviewQuery = `
      SELECT r.id, r.rating, r.comment, u.name, r.created_at 
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.book_id = ?
      ORDER BY r.created_at DESC
    `;

    db.query(reviewQuery, [id], (err2, reviewResults) => {
      if (err2) {
        console.error('Review fetch error:', err2);
        book.reviews = [];
        book.average_rating = 0;
        book.review_count = 0;
      } else {
        book.reviews = reviewResults;
        book.review_count = reviewResults.length;
        book.average_rating = reviewResults.length > 0
          ? reviewResults.reduce((sum, r) => sum + r.rating, 0) / reviewResults.length
          : 0;
      }

      res.json(book);
    });
  });
});

// =======================
// ADD REVIEW             ✅ NEW
// =======================
router.post('/:id/reviews', authMiddleware, (req, res) => {
  const bookId = req.params.id;
  const { rating, comment } = req.body;

  if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1–5' });
  if (!comment || !comment.trim()) return res.status(400).json({ message: 'Comment is required' });

  const insertQuery = 'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)';

  db.query(insertQuery, [req.user.id, bookId, rating, comment], (err, result) => {
    if (err) {
      console.error('DB ERROR:', err);
      return res.status(500).json({ message: 'Failed to add review' });
    }
    res.json({ message: 'Review added successfully', reviewId: result.insertId });
  });
});

// =======================
// ADD NEW BOOK
// =======================
router.post('/', (req, res) => {
  const { title, author, description, price, rating, category, image_url, stock, genre, pages, language, publisher } = req.body;

  const query = `
    INSERT INTO books 
    (title, author, description, price, rating, category, image_url, stock, genre, pages, language, publisher)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [title, author, description, price, rating, category, image_url, stock, genre, pages, language, publisher],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.json({ message: 'Book added', id: result.insertId });
    }
  );
});

// =======================
// UPDATE BOOK
// =======================
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, description, price, rating, category, image_url, stock, genre, pages, language, publisher } = req.body;

  const query = `
    UPDATE books
    SET title=?, author=?, description=?, price=?, rating=?, category=?, image_url=?, stock=?, genre=?, pages=?, language=?, publisher=?
    WHERE id=?
  `;

  db.query(
    query,
    [title, author, description, price, rating, category, image_url, stock, genre, pages, language, publisher, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
      res.json({ message: 'Book updated successfully' });
    }
  );
});

// =======================
// DELETE BOOK
// =======================
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id=?';

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  });
});

module.exports = router;