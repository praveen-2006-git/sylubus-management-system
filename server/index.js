const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
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
