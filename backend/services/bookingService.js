const BookingModel = require('../models/bookingModel');
const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel'); // Ensure User schema is registered for populate
const { calculateBookingTotal } = require('../utils/bookingPricing');

async function reconcileBookingPrice(booking, event) {
  if (!booking || !event) return booking;

  const { totalPrice: correctTotal } = calculateBookingTotal(
    event,
    booking.quantity,
    booking.ticketType
  );

  if (Math.abs((booking.totalPrice || 0) - correctTotal) > 0.01) {
    booking.totalPrice = correctTotal;
    await booking.save();
  }

  return booking;
}

async function reconcileBookingsList(bookings) {
  await Promise.all(
    bookings.map(async (b) => {
      const event = b.event;
      if (event && event._id) {
        await reconcileBookingPrice(b, event);
      }
    })
  );
  return bookings;
}

async function createBooking({ userId, eventId, quantity, totalPrice, ticketType }) {
  const event = await EventModel.findById(eventId);
  if (!event) {
    const err = new Error('Event not found');
    err.status = 404;
    throw err;
  }

  if (!event.isApproved) {
    const err = new Error('Cannot book an event that is not approved');
    err.status = 400;
    throw err;
  }

  // Block booking of past events
  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (eventDate < today) {
    const err = new Error('Cannot book a past event');
    err.status = 400;
    throw err;
  }

  if (event.availableSeats < quantity) {
    const err = new Error('Not enough seats available');
    err.status = 400;
    throw err;
  }

  const type = ticketType || 'Normal';
  const { totalPrice: chargedTotal } = calculateBookingTotal(event, quantity, type);

  const booking = await BookingModel.create({
    user: userId,
    event: eventId,
    quantity,
    totalPrice: chargedTotal,
    ticketType: type,
  });

  // Atomically decrement seats so we avoid full document validation
  // on legacy events and prevent concurrent overselling.
  const updateResult = await EventModel.updateOne(
    { _id: eventId, availableSeats: { $gte: quantity } },
    { $inc: { availableSeats: -quantity } }
  );

  if (updateResult.modifiedCount === 0) {
    await BookingModel.findByIdAndDelete(booking._id);
    const err = new Error('Not enough seats available');
    err.status = 400;
    throw err;
  }

  return await booking.populate(['user', 'event']);
}

async function listUserBookings(userId) {
  const bookings = await BookingModel.find({ user: userId }).populate('event');
  return reconcileBookingsList(bookings);
}

async function listAllBookings() {
  const bookings = await BookingModel.find().populate(['user', 'event']);
  return reconcileBookingsList(bookings);
}

/** Returns bookings only for events owned by this organizer or general seeded events (available to all) */
async function listBookingsByOrganizer(organizerId) {
  // Find all events by this organizer first, including seeded general events
  const events = await EventModel.find({
    $or: [
      { organizerId },
      { organizerId: null },
      { organizerId: { $exists: false } }
    ]
  }).select('_id');
  const eventIds = events.map(e => e._id);
  const bookings = await BookingModel.find({ event: { $in: eventIds } }).populate(['user', 'event']);
  return reconcileBookingsList(bookings);
}

module.exports = {
  createBooking,
  listUserBookings,
  listAllBookings,
  listBookingsByOrganizer,
};

