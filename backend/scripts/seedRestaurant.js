const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const seedRestaurant = async () => {
  try {
    await connectDB();

    const email = 'restaurant@cravebit.com';
    const existing = await User.findOne({ email });

    if (existing) {
      // Delete and re-seed to ensure password is hashed correctly
      await User.deleteOne({ email });
      console.log('Existing restaurant user removed, re-seeding...');
    }

    const restaurantUser = await User.create({
      name: 'Restaurant Manager',
      email,
      password: 'restaurant123',
      phone: '9876543210',
      role: 'restaurant',
    });

    console.log('✅ Restaurant user seeded successfully!');
    console.log('   Email   :', restaurantUser.email);
    console.log('   Password: restaurant123');
    console.log('   Role    :', restaurantUser.role);
    process.exit();
  } catch (error) {
    console.error('Error seeding restaurant user:', error);
    process.exit(1);
  }
};

seedRestaurant();
