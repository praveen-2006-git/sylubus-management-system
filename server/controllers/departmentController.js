const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public/Private (Need to be logged in to see? Prompt says "Admin... Full CRUD". Others might need to list them for dropdowns)
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private (Admin)
const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const exists = await Department.findOne({ name });
        if (exists) {
            return res.status(400).json({ message: 'Department already exists' });
        }
        const department = await Department.create({ name, description });
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (department) {
            await department.deleteOne();
            res.json({ message: 'Department removed' });
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDepartments,
    createDepartment,
    deleteDepartment
};
