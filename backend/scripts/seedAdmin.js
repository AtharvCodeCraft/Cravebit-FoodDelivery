const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@cravebit.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const adminUser = await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: 'admin123', // Will be hashed by pre-save hook
      phone: '1234567890',
      role: 'admin',
    });

    console.log('Admin user seeded successfully:', adminUser.email);
    process.exit();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
