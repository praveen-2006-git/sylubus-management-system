const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); // Removed for plain text password

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Login user (Admin, Faculty, Student)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { username, password } = req.body;
    console.log(`[LOGIN ATTEMPT] Username: ${username}, Password: ${password}`);
    console.log(`[LOGIN ATTEMPT] Username: ${username}, Password: ${password}`);

    try {
        const user = await User.findOne({ username }).populate('department', 'name');

        if (user) {
            console.log(`[LOGIN] User found: ${user.username}, Stored Pwd: ${user.password}`);
        } else {
            console.log(`[LOGIN] User NOT found`);
        }

        if (user) {
            console.log(`[LOGIN] User found: ${user.username}, Stored Pwd: ${user.password}`);
        } else {
            console.log(`[LOGIN] User NOT found`);
        }

        if (user && (password === user.password)) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                department: user.department,
                facultyRole: user.facultyRole,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new user (Admin use only)
// @route   POST /api/admin/create-user
// @access  Private/Admin
const createUser = async (req, res) => {
    const { username, email, password, role, fullName, department, facultyRole } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: password, // Store as plain text
            role,
            fullName,
            department,
            facultyRole: role === 'Faculty' ? facultyRole : undefined
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                department: user.department
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify Token
const verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('department');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile (password)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            // Only allow password update for now, or email if not admin? 
            // Admin controls user details usually.
            if (req.body.password) {
                // const salt = await bcrypt.genSalt(10);
                // user.password = await bcrypt.hash(req.body.password, salt);
                user.password = req.body.password; // Plain text update
            }
            // Allow name update? Use case dependent.
            if (req.body.fullName) {
                user.fullName = req.body.fullName;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            // .select('-password') // User requested to see password (It will be hashed)
            .populate('department', 'name')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    login,
    createUser,
    verifyToken,
    updateProfile,
    getUsers
};
