const mongoose = require('mongoose');

// Set environment variables for config loading
process.env.MONGO_URI = 'mongodb+srv://helipatel988_db_user:heli@cluster0.3gnss5d.mongodb.net/event-management';

const eventService = require('../services/eventService');
const EventModel = require('../models/eventModel');

async function runTests() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');

    // Clean up existing test events
    await EventModel.deleteMany({ title: /^TEST_/ });

    const organizerId = new mongoose.Types.ObjectId();

    // Seed events
    const approvedEvent = await EventModel.create({
      title: 'TEST_Approved Event',
      description: 'Approved Test Description',
      date: '2026-06-01',
      time: '18:00',
      location: 'Test Venue',
      price: 10,
      isApproved: true,
      isRejected: false,
      organizerId,
    });

    const pendingEvent = await EventModel.create({
      title: 'TEST_Pending Event',
      description: 'Pending Test Description',
      date: '2026-06-02',
      time: '18:00',
      location: 'Test Venue',
      price: 15,
      isApproved: false,
      isRejected: false,
      organizerId,
    });

    const rejectedEvent = await EventModel.create({
      title: 'TEST_Rejected Event',
      description: 'Rejected Test Description',
      date: '2026-06-03',
      time: '18:00',
      location: 'Test Venue',
      price: 20,
      isApproved: false,
      isRejected: true,
      organizerId,
    });

    console.log('\n--- Running Verification ---');

    // 1. Admin events listing check (showAll = true)
    console.log('\nChecking Admin listing (showAll = true)...');
    const adminEvents = await eventService.listEvents(true);
    const testAdminEvents = adminEvents.filter(e => e.title.startsWith('TEST_'));
    console.log(`Found ${testAdminEvents.length} test events.`);
    console.log('Events in admin list:', testAdminEvents.map(e => `${e.title} (Approved: ${e.isApproved}, Rejected: ${e.isRejected})`));
    
    const containsRejectedInAdmin = testAdminEvents.some(e => e.isRejected);
    console.log('Contains rejected event:', containsRejectedInAdmin ? '❌ FAIL' : '✅ PASS');

    // 2. User events listing check (showAll = false)
    console.log('\nChecking User listing (showAll = false)...');
    const userEvents = await eventService.listEvents(false);
    const testUserEvents = userEvents.filter(e => e.title.startsWith('TEST_'));
    console.log(`Found ${testUserEvents.length} test events.`);
    console.log('Events in user list:', testUserEvents.map(e => `${e.title} (Approved: ${e.isApproved})`));

    const allApprovedInUserList = testUserEvents.every(e => e.isApproved);
    console.log('All events are approved:', allApprovedInUserList ? '✅ PASS' : '❌ FAIL');

    // 3. Organizer events listing check
    console.log('\nChecking Organizer listing...');
    const organizerEvents = await eventService.listEventsByOrganizer(organizerId);
    console.log(`Found ${organizerEvents.length} events for organizer.`);
    console.log('Events in organizer list:', organizerEvents.map(e => `${e.title} (Approved: ${e.isApproved}, Rejected: ${e.isRejected})`));

    const containsRejectedInOrg = organizerEvents.some(e => e.isRejected);
    console.log('Contains rejected event:', containsRejectedInOrg ? '❌ FAIL' : '✅ PASS');

    // Clean up
    console.log('\nCleaning up database...');
    await EventModel.deleteMany({ title: /^TEST_/ });
    console.log('Cleanup finished.');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');

    if (!containsRejectedInAdmin && allApprovedInUserList && !containsRejectedInOrg) {
      console.log('\n======================================');
      console.log('🎉 ALL BACKEND VERIFICATIONS PASSED! 🎉');
      console.log('======================================');
    } else {
      console.log('\n======================================');
      console.log('❌ SOME BACKEND VERIFICATIONS FAILED! ❌');
      console.log('======================================');
      process.exit(1);
    }
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
