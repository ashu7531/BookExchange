const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const borrowRoutes = require('./routes/borrowRoutes'); // Importing the borrow routes
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json()); // To parse JSON requests
app.use(cors()); // To enable CORS for frontend-backend communication

// Middleware for user authentication via JWT
const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    jwt.verify(token, 'your-jwt-secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = decoded; // Store user info in the request object
        next();
    });
};

// Middleware to parse JSON
app.use(express.urlencoded({ extended: true })); // For form data


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
// Routes for handling borrow requests
app.use('/api/borrowrequests', borrowRoutes); // Prefix all borrow-related routes with '/api/borrow'

// Sample route to check if the server is running
app.get('/', (req, res) => {
    res.send('Library API is running!');
});

// Error handling middleware for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
