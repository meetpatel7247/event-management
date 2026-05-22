/**
 * Migration Script: Fix VIP/VVIP prices for all existing events
 * Sets vipPrice = price + 300 and vvipPrice = price + 600
 * for every event that currently has 0 for those fields.
 *
 * Run: node fixVipPrices.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const EventModel = require('./models/eventModel');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function fixPrices() {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI not found in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const events = await EventModel.find({});
  console.log(`📋 Found ${events.length} events`);

  let updated = 0;
  for (const ev of events) {
    const base = Number(ev.price) || 0;
    const needsUpdate = (!ev.vipPrice || ev.vipPrice === 0) || (!ev.vvipPrice || ev.vvipPrice === 0);
    if (needsUpdate) {
      ev.vipPrice = base + 300;
      ev.vvipPrice = base + 600;
      await ev.save();
      console.log(`  ✏️  ${ev.title}: Normal ₹${base} → VIP ₹${ev.vipPrice}, VVIP ₹${ev.vvipPrice}`);
      updated++;
    } else {
      console.log(`  ✔️  ${ev.title}: already has VIP ₹${ev.vipPrice}, VVIP ₹${ev.vvipPrice} — skipped`);
    }
  }

  console.log(`\n🎉 Done! Updated ${updated}/${events.length} events.`);
  await mongoose.disconnect();
}

fixPrices().catch(err => {
  console.error('❌ Error:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
