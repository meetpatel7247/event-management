const mongoose = require('mongoose');
require('dotenv').config();

const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel');

// Define targets using emails of already existing organizers in your DB
const targetOrganizers = [
  { category: 'Concert', email: 'helipatel988@gmail.com' },
  { category: 'Sport', email: 'meet2324@gmail.com' },
  { category: 'Play', email: 'heli2324@gmail.com' },
  { category: 'Festival', email: 'meetlii2324@gmail.com' }
];

async function migrate() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://helipatel988_db_user:heli@cluster0.3gnss5d.mongodb.net/event-management';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { family: 4 });
    console.log('Connected successfully!');

    // 1. Locate the existing organizers in the database
    const orgMap = {};
    for (const target of targetOrganizers) {
      const user = await UserModel.findOne({ email: target.email });
      if (!user) {
        throw new Error(`Target pre-existing organizer with email ${target.email} not found!`);
      }
      orgMap[target.category] = {
        id: user._id,
        name: user.name,
        email: user.email
      };
      console.log(`Located existing organizer: "${user.name}" [${user.email}] for ${target.category}s.`);
    }

    // 2. Delete the temporary mock organizers we created earlier
    const mockEmails = ['novabeats@gmail.com', 'apexarena@gmail.com', 'broadwayguild@gmail.com', 'vibrantgala@gmail.com'];
    const deleteResult = await UserModel.deleteMany({ email: { $in: mockEmails } });
    console.log(`\nDeleted ${deleteResult.deletedCount} temporary mock organizer accounts.`);

    // 3. Update the 16 seeded events with the new pre-existing organizer associations
    console.log('\nTransferring event ownerships...');
    
    // We fetch all events to see which ones we need to migrate
    const allEvents = await EventModel.find({});
    let migrationCount = 0;

    for (const event of allEvents) {
      const cat = event.category; // 'Concert', 'Sport', 'Play', or 'Festival'
      const targetOrg = orgMap[cat];
      
      if (targetOrg) {
        // Only update if it does not already belong to an organic user (or if it currently points to a deleted mock account)
        // Since we want to transfer our seeded events, let's map them by their exact titles
        const seededTitles = [
          // Concerts
          'Neon Pulse: Cyberpunk Electronic Festival',
          'Acoustic Sunset Sessions',
          'Rock Legends Revival',
          'Retro Disco Nights',
          // Sports
          'Champions League: Legends Face-Off',
          'Pro Kabaddi Championship Finals',
          'Speedway Grand Prix: Asphalt Drifters',
          'Ultimate Tennis Masters',
          // Plays
          'The Phantom of the Opera: Reimagined',
          'Shakespeare under the Stars: Hamlet',
          'Mystery of the Crimson Manor',
          'Laughter Therapy: A Modern Comedy Play',
          // Festivals
          'Mystic Dunes: Desert Camp & Music Festival',
          'Borealis: Winter Lights & Crafts Fair',
          'Spices of India: Mega Culinary Festival',
          'Global Horizon Kite & Balloon Carnival'
        ];

        if (seededTitles.includes(event.title)) {
          event.organizerId = targetOrg.id;
          event.organizerName = targetOrg.name;
          await event.save();
          console.log(`Transferred "${event.title}" [${event.category}] -> Assigned to existing: "${targetOrg.name}" (${targetOrg.email})`);
          migrationCount++;
        }
      }
    }

    console.log(`\nSuccessfully transferred ${migrationCount} events to pre-existing organizers!`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

migrate();
