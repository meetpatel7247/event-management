const mongoose = require('mongoose');
require('dotenv').config();

const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel');

// Define 4 specialized organizers
const organizersData = [
  {
    name: 'Nova Beats Productions',
    email: 'novabeats@gmail.com',
    password: 'Organizer@1234',
    role: 'organizer',
    isApproved: true
  },
  {
    name: 'Apex Arena Group',
    email: 'apexarena@gmail.com',
    password: 'Organizer@1234',
    role: 'organizer',
    isApproved: true
  },
  {
    name: 'Broadway Guild',
    email: 'broadwayguild@gmail.com',
    password: 'Organizer@1234',
    role: 'organizer',
    isApproved: true
  },
  {
    name: 'Vibrant Gala Carnivals',
    email: 'vibrantgala@gmail.com',
    password: 'Organizer@1234',
    role: 'organizer',
    isApproved: true
  }
];

// Define 16 high-quality events to seed
const eventsTemplate = [
  // --- Concerts (Assigned to Nova Beats Productions) ---
  {
    title: 'Neon Pulse: Cyberpunk Electronic Festival',
    description: 'A high-octane electronic dance music concert featuring cutting-edge laser shows, cyberpunk stage designs, and top-tier global DJs playing progressive house and techno beats.',
    date: '2026-07-20',
    time: '21:00',
    location: 'Nesco Center, Mumbai',
    category: 'Concert',
    price: 999,
    vipPrice: 1999,
    vvipPrice: 3499,
    availableSeats: 1500,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 15,
    isApproved: true,
    isRejected: false,
    likes: 310,
    shares: 88,
    organizerKey: 'novabeats@gmail.com'
  },
  {
    title: 'Acoustic Sunset Sessions',
    description: 'An intimate seaside acoustic concert featuring indie singer-songwriters under the warm hues of the setting sun. Sit back on cozy beanbags, sip craft beverages, and enjoy soulful tunes.',
    date: '2026-07-28',
    time: '17:30',
    location: 'Bayview Lawns, Goa',
    category: 'Concert',
    price: 599,
    vipPrice: 1299,
    vvipPrice: 2199,
    availableSeats: 300,
    image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 3,
    offerDiscount: 10,
    isApproved: true,
    isRejected: false,
    likes: 142,
    shares: 34,
    organizerKey: 'novabeats@gmail.com'
  },
  {
    title: 'Rock Legends Revival',
    description: "Get ready to rock! A monumental tribute concert bringing back the golden era of rock 'n' roll with covers of Led Zeppelin, Queen, and Pink Floyd performed by a star-studded rock band.",
    date: '2026-08-10',
    time: '19:00',
    location: 'Jawaharlal Nehru Stadium, Delhi',
    category: 'Concert',
    price: 799,
    vipPrice: 1599,
    vvipPrice: 2999,
    availableSeats: 2000,
    image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 5,
    offerDiscount: 20,
    isApproved: true,
    isRejected: false,
    likes: 415,
    shares: 110,
    organizerKey: 'novabeats@gmail.com'
  },
  {
    title: 'Retro Disco Nights',
    description: 'Step back in time to the glamorous 80s! Glitter balls, neon outfits, and legendary disco tracks that will keep you dancing all night. Dress code: Retro chic.',
    date: '2026-08-18',
    time: '20:00',
    location: 'The Warehouse Club, Bangalore',
    category: 'Concert',
    price: 499,
    vipPrice: 1099,
    vvipPrice: 1899,
    availableSeats: 600,
    image: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 12,
    isApproved: true,
    isRejected: false,
    likes: 218,
    shares: 55,
    organizerKey: 'novabeats@gmail.com'
  },

  // --- Sports (Assigned to Apex Arena Group) ---
  {
    title: 'Champions League: Legends Face-Off',
    description: 'A high-stakes, thrilling exhibition football match featuring former international football legends. Expect incredible skills, dynamic plays, and an electric stadium atmosphere.',
    date: '2026-07-25',
    time: '16:00',
    location: 'Salt Lake Stadium, Kolkata',
    category: 'Sport',
    price: 390,
    vipPrice: 990,
    vvipPrice: 1790,
    availableSeats: 5000,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 5,
    offerDiscount: 15,
    isApproved: true,
    isRejected: false,
    likes: 642,
    shares: 198,
    organizerKey: 'apexarena@gmail.com'
  },
  {
    title: 'Pro Kabaddi Championship Finals',
    description: 'Witness the breath-taking finale of the national kabaddi championship! Fast raids, solid tackles, and intense combat sports action live from the arena.',
    date: '2026-08-05',
    time: '18:00',
    location: 'Kanteerava Indoor Stadium, Bangalore',
    category: 'Sport',
    price: 299,
    vipPrice: 799,
    vvipPrice: 1499,
    availableSeats: 1200,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 10,
    isApproved: true,
    isRejected: false,
    likes: 285,
    shares: 63,
    organizerKey: 'apexarena@gmail.com'
  },
  {
    title: 'Speedway Grand Prix: Asphalt Drifters',
    description: "The country's premier drifting tournament! Experience burning rubber, screeching tires, and precision driving as elite racers battle for the championship trophy.",
    date: '2026-08-30',
    time: '14:00',
    location: 'Buddh International Circuit, Greater Noida',
    category: 'Sport',
    price: 899,
    vipPrice: 1899,
    vvipPrice: 3299,
    availableSeats: 3000,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 12,
    isApproved: true,
    isRejected: false,
    likes: 472,
    shares: 135,
    organizerKey: 'apexarena@gmail.com'
  },
  {
    title: 'Ultimate Tennis Masters',
    description: 'Top seed tennis players clash in a thrilling single-elimination tournament. High-speed aces, baseline rallies, and world-class tennis sportsmanship.',
    date: '2026-09-12',
    time: '10:00',
    location: 'RK Khanna Tennis Stadium, Delhi',
    category: 'Sport',
    price: 499,
    vipPrice: 1199,
    vvipPrice: 1999,
    availableSeats: 800,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 3,
    offerDiscount: 10,
    isApproved: true,
    isRejected: false,
    likes: 194,
    shares: 41,
    organizerKey: 'apexarena@gmail.com'
  },

  // --- Plays (Assigned to Broadway Guild) ---
  {
    title: 'The Phantom of the Opera: Reimagined',
    description: 'An outstanding local adaptation of the famous romantic tragedy. Stunning stage designs, flawless vocals, and dramatic storytelling that will capture your heart.',
    date: '2026-08-01',
    time: '18:30',
    location: 'Royal Opera House, Mumbai',
    category: 'Play',
    price: 999,
    vipPrice: 1899,
    vvipPrice: 2999,
    availableSeats: 350,
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 3,
    offerDiscount: 10,
    isApproved: true,
    isRejected: false,
    likes: 215,
    shares: 59,
    organizerKey: 'broadwayguild@gmail.com'
  },
  {
    title: 'Shakespeare under the Stars: Hamlet',
    description: "Experience Shakespeare's timeless masterpiece 'Hamlet' performed live in an open-air amphitheater surrounded by lush trees and a starry night sky.",
    date: '2026-08-15',
    time: '19:30',
    location: 'Sanjay Gandhi National Park Amphitheater, Mumbai',
    category: 'Play',
    price: 699,
    vipPrice: 1399,
    vvipPrice: 2299,
    availableSeats: 400,
    image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 15,
    isApproved: true,
    isRejected: false,
    likes: 188,
    shares: 49,
    organizerKey: 'broadwayguild@gmail.com'
  },
  {
    title: 'Mystery of the Crimson Manor',
    description: 'An interactive murder mystery play where the audience helps solve the crime. High suspense, brilliant plot twists, and detective drama at its finest.',
    date: '2026-09-02',
    time: '20:00',
    location: 'Kamani Auditorium, Delhi',
    category: 'Play',
    price: 599,
    vipPrice: 1199,
    vvipPrice: 1999,
    availableSeats: 500,
    image: 'https://images.unsplash.com/photo-1503095391755-14144f54d25e?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 3,
    offerDiscount: 10,
    isApproved: true,
    isRejected: false,
    likes: 164,
    shares: 32,
    organizerKey: 'broadwayguild@gmail.com'
  },
  {
    title: 'Laughter Therapy: A Modern Comedy Play',
    description: 'A side-splitting satirical play focusing on the quirks of modern city life, corporate culture, and relationships. Guaranteed to keep you laughing from start to finish.',
    date: '2026-09-18',
    time: '19:00',
    location: 'St. Andrews Auditorium, Mumbai',
    category: 'Play',
    price: 499,
    vipPrice: 999,
    vvipPrice: 1699,
    availableSeats: 600,
    image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 12,
    isApproved: true,
    isRejected: false,
    likes: 312,
    shares: 88,
    organizerKey: 'broadwayguild@gmail.com'
  },

  // --- Festivals (Assigned to Vibrant Gala Carnivals) ---
  {
    title: 'Mystic Dunes: Desert Camp & Music Festival',
    description: 'A breathtaking 2-day festival under the desert stars featuring folk musicians, electronic beats, dune bashing, camel safaris, and traditional Rajasthani cuisine.',
    date: '2026-10-02',
    time: '15:00',
    location: 'Sam Sand Dunes, Jaisalmer',
    category: 'Festival',
    price: 1999,
    vipPrice: 3999,
    vvipPrice: 5999,
    availableSeats: 1000,
    image: 'https://images.unsplash.com/photo-1472653423608-5778a6db6f30?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 15,
    isApproved: true,
    isRejected: false,
    likes: 540,
    shares: 180,
    organizerKey: 'vibrantgala@gmail.com'
  },
  {
    title: 'Borealis: Winter Lights & Crafts Fair',
    description: 'A glowing winter festival featuring stunning light installations, hot chocolate bars, artisan craft markets, ice sculpture showcases, and live acoustic music.',
    date: '2026-11-20',
    time: '16:30',
    location: 'Rose Garden Expo Grounds, Chandigarh',
    category: 'Festival',
    price: 299,
    vipPrice: 699,
    vvipPrice: 1199,
    availableSeats: 2000,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 5,
    offerDiscount: 20,
    isApproved: true,
    isRejected: false,
    likes: 318,
    shares: 74,
    organizerKey: 'vibrantgala@gmail.com'
  },
  {
    title: 'Spices of India: Mega Culinary Festival',
    description: "The ultimate food lover's paradise! Over 200 culinary stalls representing regional cuisines, live masterclasses by celebrity chefs, food challenges, and cultural dances.",
    date: '2026-10-12',
    time: '11:00',
    location: 'MMRDA Grounds, Mumbai',
    category: 'Festival',
    price: 199,
    vipPrice: 499,
    vvipPrice: 999,
    availableSeats: 3000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 6,
    offerDiscount: 15,
    isApproved: true,
    isRejected: false,
    likes: 712,
    shares: 245,
    organizerKey: 'vibrantgala@gmail.com'
  },
  {
    title: 'Global Horizon Kite & Balloon Carnival',
    description: 'A colorful sky festival featuring international kite flyers, grand hot air balloon rides, wind-chime workshops, and live band performances under the autumn sky.',
    date: '2026-10-25',
    time: '08:00',
    location: 'Sabarmati Riverfront, Ahmedabad',
    category: 'Festival',
    price: 399,
    vipPrice: 999,
    vvipPrice: 1799,
    availableSeats: 1500,
    image: 'https://images.unsplash.com/photo-1507504038482-7621c379a54f?q=80&w=1000&auto=format&fit=crop',
    offerMinTickets: 4,
    offerDiscount: 12,
    isApproved: true,
    isRejected: false,
    likes: 295,
    shares: 81,
    organizerKey: 'vibrantgala@gmail.com'
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://helipatel988_db_user:heli@cluster0.3gnss5d.mongodb.net/event-management';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { family: 4 });
    console.log('Connected successfully!');

    // 1. Seed or Find Organizers
    const organizerMap = {};
    for (const orgData of organizersData) {
      let user = await UserModel.findOne({ email: orgData.email });
      if (!user) {
        user = await UserModel.create(orgData);
        console.log(`Created Organizer: "${user.name}" [Email: ${user.email}]`);
      } else {
        console.log(`Organizer "${user.name}" already exists.`);
      }
      organizerMap[orgData.email] = {
        id: user._id,
        name: user.name
      };
    }

    console.log('\nStarting event seeding...');

    // 2. Seed 16 Events
    for (const ev of eventsTemplate) {
      // Get associated organizer info
      const orgInfo = organizerMap[ev.organizerKey];
      if (!orgInfo) {
        console.error(`Could not find organizer info for key: ${ev.organizerKey}`);
        continue;
      }

      // Prepare final event payload
      const eventPayload = {
        title: ev.title,
        description: ev.description,
        date: ev.date,
        time: ev.time,
        location: ev.location,
        category: ev.category,
        price: ev.price,
        vipPrice: ev.vipPrice,
        vvipPrice: ev.vvipPrice,
        availableSeats: ev.availableSeats,
        image: ev.image,
        offerMinTickets: ev.offerMinTickets,
        offerDiscount: ev.offerDiscount,
        isApproved: ev.isApproved,
        isRejected: ev.isRejected,
        likes: ev.likes,
        shares: ev.shares,
        organizerId: orgInfo.id,
        organizerName: orgInfo.name
      };

      // Check if event already exists
      const exists = await EventModel.findOne({ title: eventPayload.title });
      if (exists) {
        // Update its organizer information in case it was a general event previously
        exists.organizerId = eventPayload.organizerId;
        exists.organizerName = eventPayload.organizerName;
        await exists.save();
        console.log(`Event "${eventPayload.title}" already exists. Synced Organizer.`);
      } else {
        await EventModel.create(eventPayload);
        console.log(`Successfully added event: "${eventPayload.title}" [Category: ${eventPayload.category}] -> Assigned to: ${eventPayload.organizerName}`);
      }
    }

    console.log('\nSeeding of 16 divided events completed successfully!');
  } catch (error) {
    console.error('Error seeding 16 events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
