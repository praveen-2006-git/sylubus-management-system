
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const Subject = require('./models/Subject');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const fs = require('fs');

dotenv.config();
connectDB();

const debugData = async () => {
    try {
        let output = '';

        output += '--- Departments ---\n';
        const depts = await Department.find({});
        depts.forEach(d => output += `Name: ${d.name}, ID: ${d._id}\n`);

        output += '\n--- Users ---\n';
        const users = await User.find({});
        users.forEach(u => output += `Username: ${u.username}, Role: ${u.role}, DeptID: ${u.department}\n`);

        output += '\n--- Subjects ---\n';
        const subjects = await Subject.find({});
        subjects.forEach(s => output += `Name: ${s.name}, Type: ${s.type}, DeptID: ${s.department}\n`);

        fs.writeFileSync('debug_dump.txt', output);
        console.log('Dump written to debug_dump.txt');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugData();
