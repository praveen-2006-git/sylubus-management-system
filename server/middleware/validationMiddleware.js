const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

const validateCreateUser = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Admin', 'Faculty', 'Student']).withMessage('Invalid role'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    validate
];

const validateSubject = [
    body('name').notEmpty().withMessage('Subject name is required'),
    body('code').notEmpty().withMessage('Subject code is required'),
    body('department').notEmpty().withMessage('Department ID is required'),
    body('semester').isNumeric().withMessage('Semester must be a number'),
    validate
];

const validateDepartment = [
    body('name').notEmpty().withMessage('Department name is required'),
    validate
];

module.exports = {
    validateLogin,
    validateCreateUser,
    validateSubject,
    validateDepartment
};
