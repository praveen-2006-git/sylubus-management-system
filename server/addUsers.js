const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Department = require('./models/Department');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const addUsers = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash('password123', salt);
        const adminPass = await bcrypt.hash('admin123', salt);

        // Ensure CSE department exists
        let cse = await Department.findOne({ name: 'CSE' });
        if (!cse) {
            cse = await Department.create({ name: 'CSE', description: 'Computer Science' });
        }

        // 1. Admin
        if (!await User.findOne({ username: 'admin_test' })) {
            await User.create({ username: 'admin_test', email: 'admin_test@example.com', password: adminPass, role: 'Admin', fullName: 'System Administrator' });
            console.log("Added Admin (username: admin_test, password: admin123)");
        }

        // 2. Student
        if (!await User.findOne({ username: 'student_1' })) {
            await User.create({ username: 'student_1', email: 'student1@example.com', password: pass, role: 'Student', fullName: 'Test Student', department: cse._id });
            console.log("Added Student (username: student_1, password: password123)");
        }

        // 3. Faculty Professor
        if (!await User.findOne({ username: 'prof_smith' })) {
            await User.create({ username: 'prof_smith', email: 'prof@example.com', password: pass, role: 'Faculty', facultyRole: 'Professor', fullName: 'Professor Smith', department: cse._id });
            console.log("Added Faculty Professor (username: prof_smith, password: password123)");
        }

        // 4. Faculty HOD
        if (!await User.findOne({ username: 'hod_dr_jones' })) {
            await User.create({ username: 'hod_dr_jones', email: 'hod@example.com', password: pass, role: 'Faculty', facultyRole: 'HOD', fullName: 'Dr. Jones (HOD)', department: cse._id });
            console.log("Added Faculty HOD (username: hod_dr_jones, password: password123)");
        }

        console.log("\n✅ Required users added successfully.");
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
addUsers();
