const eventService = require('../services/eventService');
const UserModel = require('../models/userModel');

function parseMaybeJson(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function normalizeEventPayload(rawBody = {}) {
  // Support direct JSON body, multipart text fields, and nested/stringified payloads.
  const body = rawBody && typeof rawBody === 'object' ? rawBody : {};
  const nestedPayload =
    parseMaybeJson(body.eventData) ||
    parseMaybeJson(body.event) ||
    parseMaybeJson(body.payload) ||
    (body.eventData && typeof body.eventData === 'object' ? body.eventData : null) ||
    (body.event && typeof body.event === 'object' ? body.event : null) ||
    (body.payload && typeof body.payload === 'object' ? body.payload : null);

  const merged = { ...body, ...(nestedPayload || {}) };
  const normalized = {
    ...merged,
    date: merged.date ?? merged.eventDate ?? merged.startDate,
    time: merged.time ?? merged.eventTime ?? merged.startTime,
    location: merged.location ?? merged.venue ?? merged.eventLocation,
    description: merged.description ?? merged.details,
  };

  ['title', 'date', 'time', 'location', 'description', 'category'].forEach((key) => {
    if (typeof normalized[key] === 'string') {
      normalized[key] = normalized[key].trim();
    }
  });

  return normalized;
}

async function getEvents(req, res, next) {
  try {
    const data = await eventService.listEvents();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/** Returns only events owned by the authenticated organizer */
async function getMyEvents(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const data = await eventService.listEventsByOrganizer(req.user.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const event = await eventService.findEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    console.log("==> Incoming createEvent req.body:", req.body);
    const payload = normalizeEventPayload(req.body);
    if (!payload.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    payload.organizerId = req.user ? req.user.userId : null;

    // Auto-set organizerName from DB user record
    if (req.user) {
      const organizer = await UserModel.findById(req.user.userId).select('name');
      if (organizer) payload.organizerName = organizer.name;
    }

    if (req.file) {
      payload.image = '/uploads/' + req.file.filename;
    }

    const created = await eventService.createEvent(payload);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    const payload = normalizeEventPayload(req.body);
    if (req.file) {
      payload.image = '/uploads/' + req.file.filename;
    }
    
    const updated = await eventService.updateEvent(req.params.id, payload);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const removed = await eventService.deleteEvent(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEvents,
  getMyEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};

