# Syllabus Management System

A web-based application for managing and distributing academic syllabi, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Admin Dashboard**: Secure login to Create, Read, Update, and Delete syllabi.
- **Student Portal**: Public access to view and search syllabi by Department and Semester.
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop.
- **REST API**: Fully documented API with JWT authentication.

## Project Structure
- `/client`: React Frontend
- `/server`: Node/Express Backend
- `/docs`: Documentation files (or see artifacts)

## Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)
- Git

## Getting Started

### 1. Setup Backend
```bash
cd server
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
npm run dev
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 3. Run Tests
```bash
cd server
npm test
```

## Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [Project Report](./PROJECT_REPORT.md)
