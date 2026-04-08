const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

require('dotenv').config();

const app = express();
app.set('trust proxy', 1); // Trust Render's proxy for express-rate-limit
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/departments', departmentRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Syllabus Management System API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
