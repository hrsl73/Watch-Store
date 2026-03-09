import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/watchstore';

const makeAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    let adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
        console.log(`Admin user already exists: ${adminUser.username}`);
    } else {
        const username = process.argv[2] || 'admin';
        const password = process.argv[3] || 'admin123';
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            existingUser.role = 'admin';
            await existingUser.save();
            console.log(`Updated existing user '${username}' to admin role.`);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            adminUser = new User({
                username,
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log(`Created new admin user: '${username}' with password '${password}'`);
        }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeAdmin();
