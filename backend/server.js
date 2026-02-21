require('dotenv').config();
console.log('process.env.JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: "https://booknest-frontend.onrender.com" // replace with your actual frontend URL after deploying
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.send("Server is running");
});

// Import routes
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const cartRoutes = require('./routes/cartRoutes');

// Route usage
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));