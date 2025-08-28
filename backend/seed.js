// Seeder script to manually add user data
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const users = [
  {
    username: 'admin',
    password: 'adminpass',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    username: 'cashier',
    password: 'cashierpass',
    email: 'cashier@example.com',
    role: 'cashier'
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    // Hash passwords before inserting
    for (let user of users) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    await User.deleteMany({}); // Optional: clear existing users
    await User.insertMany(users);
    console.log('Users seeded successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedUsers();
