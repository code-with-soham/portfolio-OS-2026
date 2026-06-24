const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio-os');
    console.log('Connected to DB for seeding...');

    await User.deleteMany(); // Clear existing
    console.log('Cleared existing users.');

    const dummyUsers = [
      { name: 'Soham', phone: '+911111111111', pinHash: '1234' },
      { name: 'Rahul', phone: '+912222222222', pinHash: '1234' },
      { name: 'Priya', phone: '+913333333333', pinHash: '1234' },
      { name: 'Amit', phone: '+914444444444', pinHash: '1234' },
      { name: 'Neha', phone: '+915555555555', pinHash: '1234' }
    ];

    for (let u of dummyUsers) {
      await User.create(u); // Pre-save hook will hash the PIN
    }

    console.log('Seeded 5 dummy users successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedUsers();
