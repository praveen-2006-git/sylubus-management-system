const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Department = require('./models/Department');
const Subject = require('./models/Subject');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await User.deleteMany({});
        await Department.deleteMany({});
        await Subject.deleteMany({});

        const salt = await bcrypt.genSalt(10);

        // 1. Create Departments
        const cse = await Department.create({ name: 'CSE', description: 'Computer Science & Engineering' });
        const ece = await Department.create({ name: 'ECE', description: 'Electronics & Communication' });
        console.log('Departments Created');

        // 2. Create Admin
        const adminPassword = await bcrypt.hash('admin123', salt);
        await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'Admin',
            fullName: 'System Administrator'
        });
        console.log('Admin Created — username: admin / password: admin123');

        // 3. Create Faculty
        const facultyPassword = await bcrypt.hash('password123', salt);
        const faculty = await User.create({
            username: 'faculty_test',
            email: 'faculty_test@example.com',
            password: facultyPassword,
            role: 'Faculty',
            fullName: 'Test Professor',
            department: cse._id,
            facultyRole: 'Professor'
        });
        console.log('Faculty Created — username: faculty_test / password: password123');

        // 4. Create Student
        const studentPassword = await bcrypt.hash('password123', salt);
        const student = await User.create({
            username: 'student_test',
            email: 'student_test@example.com',
            password: studentPassword,
            role: 'Student',
            fullName: 'Test Student',
            department: cse._id
        });
        console.log('Student Created — username: student_test / password: password123');

        // 5. Create Subject (Department)
        await Subject.create({
            name: 'Data Structures',
            code: 'CS102',
            department: cse._id,
            type: 'Department',
            facultyAssigned: faculty._id,
            enrolledStudents: [student._id],
            semester: '3',
            content: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Hashing.'
        });
        console.log('Subject Created: Data Structures');

        // 6. Create Subject (General)
        await Subject.create({
            name: 'Environmental Science',
            code: 'GEN101',
            department: cse._id,
            type: 'General',
            semester: '1',
            content: 'Ecology, Pollution, Biodiversity, Climate Change.'
        });
        console.log('Subject Created: Environmental Science (General)');

        // 7. ECE Subject
        await Subject.create({
            name: 'Digital Electronics',
            code: 'EC201',
            department: ece._id,
            type: 'Department',
            semester: '2',
            content: 'Logic Gates, Flip Flops, Counters, ADC/DAC.'
        });
        console.log('Subject Created: Digital Electronics (ECE)');

        console.log('\n✅ Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
