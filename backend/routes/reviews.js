const express = require('express');
const router = express.Router();
const { addReview, getBookWithReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Get book details with reviews
router.get('/books/:id', getBookWithReviews);

// Add review (requires login) - changed :bookId to :id
router.post('/books/:id/reviews', authMiddleware, addReview);

module.exports = router;