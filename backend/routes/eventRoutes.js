const express = require('express');
const router = express.Router();
const { optionalAuthenticate, authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');
const eventController = require('../controllers/eventController');

// GET /api/events
router.get('/', eventController.getEvents);

// GET /api/events/my-events — organizer sees only their own events
router.get('/my-events', authenticate, eventController.getMyEvents);

// POST /api/events/:id/like — { action: 'like' | 'unlike' }
router.post('/:id/like', eventController.toggleLike);

// POST /api/events/:id/share — increment share count
router.post('/:id/share', eventController.recordShare);

// GET /api/events/:id
router.get('/:id', eventController.getEventById);

// POST /api/events — Bearer token sets organizerId when present
router.post('/', authenticate, upload.single('image'), eventController.createEvent);

// PUT /api/events/:id
router.put('/:id', optionalAuthenticate, upload.single('image'), eventController.updateEvent);

// DELETE /api/events/:id
router.delete('/:id', optionalAuthenticate, eventController.deleteEvent);

module.exports = router;