require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const historyRoutes = require('./routes/historyRoutes');
const { MONGO_URI } = require('./config/config')

// Initialize the Express application
const index = express();

// Middleware for parsing JSON and URL-encoded data
index.use(express.json());
index.use(express.urlencoded({ extended: true }));

// CORS Middleware (optional, if needed for cross-origin requests)
index.use(cors({
    origin: "https://image-converter-app.vercel.app",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Adjust timeout as needed
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        console.error('Stack Trace:', error.stack);
        process.exit(1);
    }
};

connectDB();

// Route handlers
index.use('/auth', authRoutes);
index.use('/images', imageRoutes);
index.use('/user', historyRoutes);

// Error handling middleware
index.use((err, req, res, next) => {
    console.error('Unexpected error:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start the server
index.listen(5000, () => {
    console.log('Server is running on port 5000');
});
