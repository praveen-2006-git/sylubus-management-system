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
                if (req.query.department === 'General') {
                    query.type = 'General';
                } else {
                    const Department = require('../models/Department');
                    const deptDoc = await Department.findOne({ name: req.query.department });
                    if (deptDoc) {
                        query.department = deptDoc._id;
                    } else {
                        // Prevent CastError if string doesn't exist by setting an impossible ObjectId
                        query.department = '000000000000000000000000';
                    }
                }
            }
        }

        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { code: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const subjects = await Subject.find(query)
            .populate('department', 'name')
            .populate('facultyAssigned', 'fullName')
            .select('+enrolledStudents') 
            .sort({ createdAt: -1 });

        const formattedSubjects = subjects.map(subject => {
            const subjObj = subject.toObject();
            
            // For students, check if they are enrolled
            if (role === 'Student') {
                subjObj.isUserEnrolled = subject.enrolledStudents?.some(id => id.toString() === _id.toString());
            }
            
            subjObj.enrolledCount = subject.enrolledStudents?.length || 0;
            subjObj.enrolledStudents = undefined; 
            return subjObj;
        });

        res.json(formattedSubjects);
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
            .populate('enrolledStudents', 'username fullName email')
            .select('+enrolledStudents'); // Ensure enrolledStudents is explicitly selected

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const { role, department, _id, facultyRole } = req.user;

        // Access Control Check
        if (role === 'Student') {
            const subjectDeptId = subject.department && subject.department._id ? subject.department._id.toString() : subject.department?.toString();
            if (subjectDeptId !== department.toString() && subject.type !== 'General') {
                return res.status(403).json({ message: 'Not authorized to view this subject' });
            }
            // Pass a boolean so student knows if they are enrolled
            const isEnrolled = subject.enrolledStudents.some(s => s._id.toString() === _id.toString() || s.toString() === _id.toString());
            const subjectObj = subject.toObject();
            subjectObj.enrolledStudents = undefined; // Don't expose roster
            subjectObj.isUserEnrolled = isEnrolled;
            return res.json(subjectObj);
        } else if (role === 'Faculty') {
            const subjectDeptId = subject.department?._id?.toString() || subject.department?.toString();
            const userDeptId = department?.toString();

            if (facultyRole === 'HOD') {
                // HOD: Can view if subject is in their department
                if (subjectDeptId !== userDeptId) {
                    return res.status(403).json({ message: 'Not authorized: Outside Department' });
                }
            } else {
                // Professor: Can view ONLY if assigned
                const assignedId = subject.facultyAssigned?._id?.toString() || subject.facultyAssigned?.toString();
                if (assignedId !== _id.toString()) {
                    return res.status(403).json({ message: 'Not authorized: Not assigned to this subject' });
                }
            }
        }

        // Send response for non-student
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

// @desc    Toggle Enrollment in a subject
// @route   POST /api/subjects/:id/enroll
// @access  Private (Student)
const enrollSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const userId = req.user._id;
        const subjectDeptId = subject.department?.toString();
        const userDeptId = req.user.department?.toString();

        // Enforce department access rules
        if (subjectDeptId !== userDeptId && subject.type !== 'General') {
            return res.status(403).json({ message: 'Not authorized to enroll in this subject' });
        }

        const isEnrolled = subject.enrolledStudents.some(id => id.toString() === userId.toString());

        if (isEnrolled) {
            subject.enrolledStudents = subject.enrolledStudents.filter(id => id.toString() !== userId.toString());
        } else {
            subject.enrolledStudents.push(userId);
        }

        await subject.save();

        res.json({ 
            message: isEnrolled ? 'Unenrolled successfully' : 'Enrolled successfully', 
            enrolled: !isEnrolled 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    enrollSubject
};
