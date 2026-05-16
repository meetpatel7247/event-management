const bookingService = require('../services/bookingService');
const emailService = require('../services/emailService');
const eventService = require('../services/eventService');

async function createBooking(req, res, next) {
  try {
    const { eventId, quantity, totalPrice, guestName, guestEmail } = req.body;
    const userId = req.user.userId;
    const booking = await bookingService.createBooking({ userId, eventId, quantity, totalPrice });
    
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

module.exports = {
  createBooking,
  listUserBookings,
  listAllBookings,
  listOrganizerBookings,
};

