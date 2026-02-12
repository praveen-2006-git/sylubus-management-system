const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs'); // Removed for plain text password
const dotenv = require('dotenv');
const User = require('./models/User');
const Department = require('./models/Department');
const Subject = require('./models/Subject'); // Use Subject model
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await User.deleteMany({});
        await Department.deleteMany({});
        await Subject.deleteMany({});

        // 1. Create Departments
        const cse = await Department.create({ name: 'CSE', description: 'Computer Science & Engineering' });
        const ece = await Department.create({ name: 'ECE', description: 'Electronics & Communication' });

        console.log('Departments Created');

        // 2. Create Admin
        // const salt = await bcrypt.genSalt(10);
        // const password = await bcrypt.hash('password123', salt);
        // const adminPassword = await bcrypt.hash('admin123', salt);
        const password = 'password123';
        const adminPassword = 'admin123';

        await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'Admin',
            fullName: 'System Administrator'
        });
        console.log('Admin Created');

        // 3. Create Faculty
        const faculty = await User.create({
            username: 'faculty_test',
            email: 'faculty_test@example.com',
            password: password,
            role: 'Faculty',
            fullName: 'Test Professor',
            department: cse._id,
            facultyRole: 'Professor'
        });
        console.log('Faculty Created');

        // 4. Create Student
        const student = await User.create({
            username: 'student_test',
            email: 'student_test@example.com',
            password: password,
            role: 'Student',
            fullName: 'Test Student',
            department: cse._id
        });
        console.log('Student Created');

        // 5. Create Subject
        await Subject.create({
            name: 'Data Structures',
            code: 'CS102',
            department: cse._id,
            type: 'Department',
            facultyAssigned: faculty._id,
            semester: 3,
            content: 'Trees, Graphs, Linked Lists...',
            // pdfPath is optional
        });
        console.log('Subject Created: Data Structures (CSE, Assigned to Faculty)');

        // 6. Create General Subject
        await Subject.create({
            name: 'Environmental Science',
            code: 'GEN101',
            department: cse._id, // Technical owner, but type is General
            type: 'General',
            semester: 1,
            content: 'Ecology, Pollution, etc.'
        });
        console.log('Subject Created: Enviro Science (General)');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
