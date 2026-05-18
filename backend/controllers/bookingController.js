const bookingService = require('../services/bookingService');
const emailService = require('../services/emailService');
const eventService = require('../services/eventService');
const BookingModel = require('../models/bookingModel');
const EventModel   = require('../models/eventModel');

async function createBooking(req, res, next) {
  try {
    const { eventId, quantity, totalPrice, guestName, guestEmail, ticketType } = req.body;
    const userId = req.user.userId;
    const booking = await bookingService.createBooking({ userId, eventId, quantity, totalPrice, ticketType });
    
    let emailPreviewUrl = null;
    if (guestName && guestEmail) {
      const event = await eventService.findEventById(eventId);
      emailPreviewUrl = await emailService.sendBookingConfirmation(
        guestEmail, guestName, event?.title || 'Event', quantity, booking._id
      );
    }
    
    res.status(201).json({ ...booking.toObject(), emailPreviewUrl });
  } catch (err) {
    next(err);
  }
}

async function listUserBookings(req, res, next) {
  try {
    const userId = req.user.userId;
    const bookings = await bookingService.listUserBookings(userId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

async function listAllBookings(req, res, next) {
  try {
    const bookings = await bookingService.listAllBookings();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

/** Returns bookings only for events owned by the authenticated organizer */
async function listOrganizerBookings(req, res, next) {
  try {
    const organizerId = req.user.userId;
    const bookings = await bookingService.listBookingsByOrganizer(organizerId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

/** Admin only – deletes every booking and restores event seat counts */
async function resetAllBookings(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Gather per-event ticket counts before deletion
    const bookings = await BookingModel.find({}, 'event quantity');
    const seatMap = {};
    bookings.forEach(b => {
      const id = String(b.event);
      seatMap[id] = (seatMap[id] || 0) + (b.quantity || 0);
    });

    // Delete all bookings
    await BookingModel.deleteMany({});

    // Restore seats for every affected event
    const ops = Object.entries(seatMap).map(([eventId, qty]) =>
      EventModel.updateOne({ _id: eventId }, { $inc: { availableSeats: qty } })
    );
    await Promise.all(ops);

    res.json({ message: 'All ticket / booking data has been reset successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  listUserBookings,
  listAllBookings,
  listOrganizerBookings,
  resetAllBookings,
};

