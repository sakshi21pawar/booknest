const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM books';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});

module.exports = router;
