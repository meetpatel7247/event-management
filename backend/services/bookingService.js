const BookingModel = require('../models/bookingModel');
const EventModel = require('../models/eventModel');

async function createBooking({ userId, eventId, quantity, totalPrice }) {
  const event = await EventModel.findById(eventId);
  if (!event) {
    const err = new Error('Event not found');
    err.status = 404;
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

  const booking = await BookingModel.create({
    user: userId,
    event: eventId,
    quantity,
    totalPrice,
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
  return await BookingModel.find({ user: userId }).populate('event');
}

async function listAllBookings() {
  return await BookingModel.find().populate(['user', 'event']);
}

/** Returns bookings only for events owned by this organizer */
async function listBookingsByOrganizer(organizerId) {
  // Find all events by this organizer first
  const events = await EventModel.find({ organizerId }).select('_id');
  const eventIds = events.map(e => e._id);
  return await BookingModel.find({ event: { $in: eventIds } }).populate(['user', 'event']);
}

module.exports = {
  createBooking,
  listUserBookings,
  listAllBookings,
  listBookingsByOrganizer,
};

