const db = require('../db');

// Get book with reviews + average rating
const getBookWithReviews = (req, res) => {
  const bookId = req.params.id;

  const bookQuery = 'SELECT * FROM books WHERE id = ?';
  const reviewQuery = `
    SELECT r.id, r.rating, r.comment, r.created_at, u.name
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.book_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(bookQuery, [bookId], (err, bookResult) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch book', error: err });
    if (bookResult.length === 0) return res.status(404).json({ message: 'Book not found' });

    db.query(reviewQuery, [bookId], (err, reviews) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch reviews', error: err });

      const reviewCount = reviews.length;
      const averageRating = reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

      res.json({
        ...bookResult[0],
        reviews,
        average_rating: averageRating,
        review_count: reviewCount
      });
    });
  });
};

// Add review
const addReview = (req, res) => {
  const bookId = req.params.id; // ✅ fixed: was req.params.bookId
  const { rating, comment } = req.body;

  console.log("PARAMS:", req.params);
  console.log("USER:", req.user);
  console.log("BODY:", req.body);

  if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1–5' });
  if (!comment || !comment.trim()) return res.status(400).json({ message: 'Comment is required' });

  const insertQuery = 'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)';

  db.query(insertQuery, [req.user.id, bookId, rating, comment], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: 'Failed to add review' });
    }

    res.json({ message: 'Review added successfully', reviewId: result.insertId });
  });
};

module.exports = { getBookWithReviews, addReview };