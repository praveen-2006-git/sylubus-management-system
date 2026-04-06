const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        // Required for Non-Admins
        required: function () { return this.role !== 'Admin' && this.role !== 'Super Admin'; }
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Admin', 'Faculty', 'Student'],
        default: 'Student',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        // Required for Non-Admins
        required: function () { return this.role !== 'Admin' && this.role !== 'Super Admin'; }
    },
    // Faculty specific
    facultyRole: {
        type: String,
        enum: ['HOD', 'Professor'], // Restricted per user request
        required: function () { return this.role === 'Faculty'; }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
