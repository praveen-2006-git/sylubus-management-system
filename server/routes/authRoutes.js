const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/rbacMiddleware');
const { login, createUser, verifyToken, updateProfile, getUsers } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validateLogin, validateCreateUser } = require('../middleware/validationMiddleware');

router.post('/login', loginLimiter, validateLogin, login);
router.post('/admin/create-user', protect, authorize('Admin'), validateCreateUser, createUser);
router.get('/admin/users', protect, authorize('Admin'), getUsers); // New Route
router.get('/verify', protect, verifyToken);
router.put('/profile', protect, updateProfile);

module.exports = router;
