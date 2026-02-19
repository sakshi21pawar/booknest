require('dotenv').config();
console.log('process.env.JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
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

// Serve frontend build for production
if (process.env.NODE_ENV === 'production') {
     app.use(express.static('/opt/render/project/src/frontend/build'));

    app.get('/{*splat}', (req, res) => {
        res.sendFile('/opt/render/project/src/frontend/build/index.html');
    });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));