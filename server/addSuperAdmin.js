const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const addSuperAdmin = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash('superadmin123', salt);

        // Super Admin
        if (!await User.findOne({ username: 'superadmin' })) {
            await User.create({ 
                username: 'superadmin', 
                email: 'superadmin@example.com', 
                password: pass, 
                role: 'Super Admin', 
                fullName: 'Global System Administrator' 
            });
            console.log("✅ Added Super Admin (username: superadmin, password: superadmin123)");
        } else {
            console.log("ℹ️ Super Admin already exists.");
        }

        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
addSuperAdmin();
