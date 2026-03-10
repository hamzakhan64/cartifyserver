const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const name = 'Admin User';
        const email = 'admin@cartify.com';
        const password = 'hamzakhan'; // To be updated by user

        let user = await User.findOne({ email });
        if (user) {
            user.role = 'admin';
            user.password = password; // Hashing will be handled by pre-save hook
            await user.save();
            console.log('Admin user updated successfully.');
        } else {
            user = new User({ name, email, password, role: 'admin' });
            await user.save();
            console.log('Admin user created successfully.');
        }
    } catch (err) {
        console.error('Error creating admin:', err.message);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();
