const Syllabus = require('../models/Syllabus');

// @desc    Get all syllabi (Optionally filter by department/semester)
// @route   GET /api/syllabus
// @access  Public
const getSyllabi = async (req, res) => {
    try {
        const { department, semester, search } = req.query;
        let query = {};

        if (department) query.department = department;
        if (semester) query.semester = semester;
        if (search) {
            query.$or = [
                { subjectName: { $regex: search, $options: 'i' } },
                { subjectCode: { $regex: search, $options: 'i' } },
            ];
        }


        const syllabi = await Syllabus.find(query).sort({ createdAt: -1 });
        res.json(syllabi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single syllabus by ID
// @route   GET /api/syllabus/:id
// @access  Public
const getSyllabusById = async (req, res) => {
    try {
        const syllabus = await Syllabus.findById(req.params.id);
        if (syllabus) {
            res.json(syllabus);
        } else {
            res.status(404).json({ message: 'Syllabus not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Create a new syllabus
// @route   POST /api/syllabus
// @access  Private (Admin)
const createSyllabus = async (req, res) => {
    const { department, semester, subjectName, subjectCode, content } = req.body;
    const pdfPath = req.file ? req.file.path : null;

    try {
        const newSyllabus = new Syllabus({
            department,
            semester,
            subjectName,
            subjectCode,
            content,
            pdfPath
        });
        await newSyllabus.save();
        res.status(201).json(newSyllabus);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a syllabus
// @route   PUT /api/syllabus/:id
// @access  Private (Admin)
const updateSyllabus = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (req.file) {
            updates.pdfPath = req.file.path;
        }

        const updatedSyllabus = await Syllabus.findByIdAndUpdate(id, updates, { new: true });

        if (updatedSyllabus) {
            res.json(updatedSyllabus);
        } else {
            res.status(404).json({ message: 'Syllabus not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a syllabus
// @route   DELETE /api/syllabus/:id
// @access  Private (Admin)
const deleteSyllabus = async (req, res) => {
    try {
        const syllabus = await Syllabus.findById(req.params.id);

        if (syllabus) {
            await syllabus.deleteOne();
            res.json({ message: 'Syllabus removed' });
        } else {
            res.status(404).json({ message: 'Syllabus not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSyllabi,
    getSyllabusById,
    createSyllabus,
    updateSyllabus,
    deleteSyllabus,
};
