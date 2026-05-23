/**
 * Migration Script: Fix large base64 images in events (Optimized)
 * Uses MongoDB Regex and Projections to find base64 images in milliseconds
 * and performs a direct database update to replace them with Unsplash URLs.
 *
 * Run: node scripts/fixBase64Images.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const EventModel = require('../models/eventModel');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function fixBase64Images() {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI not found in .env');
    process.exit(1);
  }

  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  console.log('🔍 Scanning database for events with base64 images (optimized query)...');
  // Only query documents where image starts with 'data:image/' and only fetch '_id' and 'title'
  const events = await EventModel.find({ image: /^data:image\// }, 'title');
  console.log(`📋 Found ${events.length} events matching base64 pattern.`);

  let updated = 0;
  const placeholderImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000';

  for (const ev of events) {
    console.log(`  Found event with base64 image: "${ev.title}"`);
    // Direct database update without loading the heavy document
    await EventModel.updateOne({ _id: ev._id }, { $set: { image: placeholderImage } });
    console.log(`  ✏️  Successfully updated "${ev.title}" with lightweight Unsplash image.`);
    updated++;
  }

  console.log(`\n🎉 Done! Cleaned up ${updated} events.`);
  await mongoose.disconnect();
}

fixBase64Images().catch(err => {
  console.error('❌ Error:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
