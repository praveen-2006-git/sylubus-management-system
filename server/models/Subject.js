const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    type: {
        type: String,
        enum: ['Department', 'General'],
        required: true,
        default: 'Department'
    },
    facultyAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Preserving legacy fields for frontend compatibility for now
    semester: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    pdfPath: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
