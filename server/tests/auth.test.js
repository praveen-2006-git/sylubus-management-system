const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock the User model
jest.mock('../models/User');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
});

describe('Auth API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/login', () => {
        it('should return 401 for invalid credentials', async () => {
            User.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'wronguser', password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('Invalid credentials');
        });

        it('should return token and user data for valid credentials', async () => {
            const mockUser = {
                _id: '12345',
                id: '12345',
                username: 'admin',
                password: '$2a$10$hashedpassword',
                role: 'Admin',
                fullName: 'System Admin'
            };

            User.findOne.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockUser)
            });

            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'admin', password: 'admin123' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.username).toBe('admin');
            expect(res.body.role).toBe('Admin');
        });
    });
});
