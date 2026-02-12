const Subject = require('../models/Subject');
const User = require('../models/User');

// @desc    Get subjects based on role
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
    try {
        const { role, department, _id, facultyRole } = req.user;
        let query = {};

        if (role === 'Student') {
            // Student: My Dept + General
            query = {
                $or: [
                    { department: department },
                    { type: 'General' }
                ]
            };
        } else if (role === 'Faculty') {
            if (facultyRole === 'HOD') {
                // HOD: See ALL subjects in their department
                query = { department: department };
            } else {
                // Professor: See ONLY subjects assigned to them
                query = { facultyAssigned: _id };
            }
        } else if (role === 'Admin') {
            // Admin: All (Optional filter by dept)
            if (req.query.department) {
                query.department = req.query.department;
            }
        }

        const subjects = await Subject.find(query)
            .populate('department', 'name')
            .populate('facultyAssigned', 'fullName')
            .sort({ createdAt: -1 });

        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single subject by ID
// @route   GET /api/subjects/:id
// @access  Private
const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate('department', 'name')
            .populate('facultyAssigned', 'fullName')
            .populate('enrolledStudents', 'username fullName email'); // Populate students for Faculty/Admin

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const { role, department, _id, facultyRole } = req.user;

        // Access Control Check
        if (role === 'Student') {
            if (subject.department.toString() !== department.toString() && subject.type !== 'General') {
                return res.status(403).json({ message: 'Not authorized to view this subject' });
            }
            // Students cannot view enrolled list
            subject.enrolledStudents = undefined;
        } else if (role === 'Faculty') {
            if (facultyRole === 'HOD') {
                // HOD: Can view if subject is in their department
                if (subject.department._id.toString() !== department.toString() && subject.department.toString() !== department.toString()) {
                    return res.status(403).json({ message: 'Not authorized: Outside Department' });
                }
            } else {
                // Professor: Can view ONLY if assigned
                const isAssigned = subject.facultyAssigned?._id?.toString() === _id.toString() || subject.facultyAssigned?.toString() === _id.toString();
                if (!isAssigned) {
                    return res.status(403).json({ message: 'Not authorized: Not assigned to this subject' });
                }
            }
        }

        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private (Admin)
const createSubject = async (req, res) => {
    try {
        const { name, code, department, type, facultyAssigned, semester, content } = req.body;
        const pdfPath = req.file ? req.file.path : null;

        const subjectExists = await Subject.findOne({ code });
        if (subjectExists) {
            return res.status(400).json({ message: 'Subject code already exists' });
        }

        const subject = await Subject.create({
            name,
            code,
            department,
            type,
            facultyAssigned: facultyAssigned || null,
            semester,
            content,
            pdfPath
        });

        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin)
const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (req.file) {
            updates.pdfPath = req.file.path;
        }

        const updatedSubject = await Subject.findByIdAndUpdate(id, updates, { new: true });

        if (updatedSubject) {
            res.json(updatedSubject);
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (subject) {
            await subject.deleteOne();
            res.json({ message: 'Subject removed' });
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
};
