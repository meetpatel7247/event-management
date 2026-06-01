const mongoose = require('mongoose');
require('dotenv').config();

const EventModel = require('../models/eventModel');

const newEvents = [
  {
    title: 'Ethereal Symphony: Neon Lights Tour',
    description: 'Experience a breathtaking audio-visual masterpiece featuring world-renowned progressive house artists and a stunning, immersive live orchestra. Get ready for mesmerizing light installations, chest-thumping bass, and a magical night of electronic symphony under the starlit sky.',
    date: '2026-07-15',
    time: '19:30',
    location: 'Royal Arena Grounds, Mumbai',
    category: 'Concert',
    price: 1499,
    vipPrice: 2499,
    vvipPrice: 3999,
    availableSeats: 500,
    organizerName: 'Vibe Events',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 15,
    isApproved: true,
    isRejected: false,
    likes: 245,
    shares: 84
  },
  {
    title: 'The Grand Lantern & Gastronomy Carnival',
    description: 'A celestial celebration of flavors, culture, and light! Immerse yourself in a sensory wonderland filled with hundreds of gourmet food trucks, live acoustic stages, local craft exhibitions, and the spectacular midnight sky lantern release. A perfect weekend escape for friends and families.',
    date: '2026-08-22',
    time: '16:00',
    location: 'Serene Meadows Expo Park, Pune',
    category: 'Festival',
    price: 499,
    vipPrice: 1199,
    vvipPrice: 1999,
    availableSeats: 1200,
    organizerName: 'Vibe Events',
    image: 'https://images.unsplash.com/photo-1472653423608-5778a6db6f30?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 5,
    offerDiscount: 20,
    isApproved: true,
    isRejected: false,
    likes: 189,
    shares: 62
  },
  {
    title: 'Echoes of the Empire: An Epic Drama',
    description: 'A masterful, critically acclaimed theatrical play depicting the dramatic rise, internal betrayal, and ultimate fall of an ancient dynasty. Featuring powerhouse live performances, authentic historical costumes, and a hauntingly beautiful live classic background score.',
    date: '2026-09-05',
    time: '18:00',
    location: 'National Center for Performing Arts, Delhi',
    category: 'Play',
    price: 799,
    vipPrice: 1499,
    vvipPrice: 2499,
    availableSeats: 250,
    organizerName: 'Vibe Events',
    image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 3,
    offerDiscount: 10,
    isApproved: true,
    isRejected: false,
    likes: 95,
    shares: 28
  },
  {
    title: 'Ultimate Supercross & Freestyle Championship',
    description: "Prepare for pure adrenaline! The nation's elite supercross riders go head-to-head in a high-octane dirt track race, followed by a jaw-dropping freestyle motocross show featuring backflips, gravity-defying tricks, and pyro-technics that will leave you on the edge of your seat.",
    date: '2026-10-18',
    time: '15:00',
    location: 'DY Patil Stadium Outdoor Arena, Navi Mumbai',
    category: 'Sport',
    price: 999,
    vipPrice: 1999,
    vvipPrice: 3499,
    availableSeats: 800,
    organizerName: 'Vibe Events',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 12,
    isApproved: true,
    isRejected: false,
    likes: 312,
    shares: 104
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://helipatel988_db_user:heli@cluster0.3gnss5d.mongodb.net/event-management';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { family: 4 });
    console.log('Connected successfully!');

    for (const eventData of newEvents) {
      // Avoid inserting duplicates by checking title
      const exists = await EventModel.findOne({ title: eventData.title });
      if (exists) {
        console.log(`Event "${eventData.title}" already exists. Skipping.`);
      } else {
        await EventModel.create(eventData);
        console.log(`Successfully added event: "${eventData.title}" [Category: ${eventData.category}]`);
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
