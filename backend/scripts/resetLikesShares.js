/**
 * Reset all event likes/shares to 0 and clear every user wishlist.
 * Usage (from backend/): node scripts/resetLikesShares.js
 * Requires MONGO_URI in .env
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectDB = require('../config/db');
const eventService = require('../services/eventService');

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Add it to backend/.env');
    process.exit(1);
  }
  await connectDB();
  const result = await eventService.resetAllEngagement();
  console.log('Done.', result);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
