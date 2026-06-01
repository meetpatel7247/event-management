const mongoose = require('mongoose');
require('dotenv').config();

const UserModel = require('../models/userModel');

async function query() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://helipatel988_db_user:heli@cluster0.3gnss5d.mongodb.net/event-management';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { family: 4 });
    console.log('Connected successfully!');

    // Query all users to see their names, emails, and roles
    const users = await UserModel.find({}).select('name email role isApproved _id');
    console.log('\nAll Users in Database:');
    console.log(JSON.stringify(users, null, 2));

  } catch (error) {
    console.error('Error querying users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

query();
