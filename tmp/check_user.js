const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../server/models/User');

dotenv.config({ path: '../server/.env' });

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'username email role');
        console.log('--- USER LIST ---');
        users.forEach(u => console.log(`${u.email} (${u.username}) - ${u.role}`));
        console.log('-----------------');
        
        const target = await User.findOne({ email: 'new@example.com' });
        if (target) {
            console.log('SUCCESS: new@example.com exists.');
        } else {
            console.log('WARNING: new@example.com NOT FOUND in database.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
