const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  try {
    console.log('MONGO_URI from .env:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('Connected DB Name:', mongoose.connection.name);
    
    // Let's count users and events in this connected database
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections in this DB:', collections.map(c => c.name));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

test();
