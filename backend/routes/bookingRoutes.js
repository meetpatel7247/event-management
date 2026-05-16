const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate); // All booking routes require authentication

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.listUserBookings);
router.get('/all', bookingController.listAllBookings); // Admin feature
router.get('/organizer-bookings', bookingController.listOrganizerBookings); // Organizer sees their events' bookings

module.exports = router;

