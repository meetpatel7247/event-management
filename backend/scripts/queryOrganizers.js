const mongoose = require('mongoose');
require('dotenv').config();

const UserModel = require('../models/userModel');

async function query() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://helipatel988_db_user:heli@cluster0.3gnss5d.mongodb.net/event-management';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { family: 4 });
    console.log('Connected successfully!');

    const organizers = await UserModel.find({ role: 'organizer' }).select('name email role _id');
    console.log('\nFound Organizers:');
    console.log(JSON.stringify(organizers, null, 2));

  } catch (error) {
    console.error('Error querying organizers:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

query();
