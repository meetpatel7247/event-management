const mongoose = require('mongoose');
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
    const showAll = req.user && req.user.role === 'admin';
    const data = await eventService.listEvents(showAll);
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Event ID format' });
    }
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Event ID format' });
    }
    
    const event = await eventService.findEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = normalizeEventPayload(req.body);
    if (req.file) {
      payload.image = '/uploads/' + req.file.filename;
    }

    // Role checks
    if (req.user.role === 'admin') {
      const isApproveRequest = payload.isApproved === true || payload.isApproved === 'true';
      const isRejectRequest = payload.rejectEdits === true || payload.rejectEdits === 'true';
      const isRejectEventRequest = payload.isRejected === true || payload.isRejected === 'true';

      if (isApproveRequest) {
        if (event.hasPendingEdits && event.tempEdits) {
          // Apply tempEdits
          Object.assign(event, event.tempEdits);
          event.tempEdits = null;
          event.hasPendingEdits = false;
        }
        event.isApproved = true;
        event.isRejected = false;
        await event.save();
        return res.json(event);
      } else if (isRejectRequest) {
        event.tempEdits = null;
        event.hasPendingEdits = false;
        await event.save();
        return res.json(event);
      } else if (isRejectEventRequest) {
        event.isApproved = false;
        event.isRejected = true;
        event.hasPendingEdits = false;
        event.tempEdits = null;
        await event.save();
        return res.json(event);
      } else {
        return res.status(403).json({ error: 'Admins cannot edit event details directly. Only organizers can edit event details.' });
      }
    } else if (req.user.role === 'organizer') {
      const orgId = event.organizerId?._id ? event.organizerId._id.toString() : event.organizerId?.toString();
      if (orgId && orgId !== req.user.userId) {
        return res.status(403).json({ error: 'Forbidden: You do not own this event.' });
      }

      if (event.isApproved) {
        if (payload.title) {
          const cleanTitle = payload.title.trim();
          const exists = await mongoose.model('Event').findOne({
            _id: { $ne: req.params.id },
            title: { $regex: new RegExp(`^${cleanTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
          });
          if (exists) {
            return res.status(400).json({ error: 'An event with this title already exists. Please choose a unique title.' });
          }
        }

        const editableFields = [
          'title', 'description', 'date', 'time', 'location', 'category',
          'price', 'vipPrice', 'vvipPrice', 'availableSeats', 'image',
          'offerMinTickets', 'offerDiscount'
        ];
        
        const edits = {};
        editableFields.forEach(field => {
          if (payload[field] !== undefined) {
            if (['price', 'vipPrice', 'vvipPrice', 'availableSeats', 'offerMinTickets', 'offerDiscount'].includes(field)) {
              if (payload[field] !== null) edits[field] = Number(payload[field]);
            } else {
              edits[field] = payload[field];
            }
          }
        });

        if (payload.image) {
          edits.image = payload.image;
        }

        if (Object.keys(edits).length > 0) {
          event.tempEdits = { ...(event.tempEdits || {}), ...edits };
          event.hasPendingEdits = true;
          await event.save();
        }

        return res.json({
          message: 'Your edits have been submitted for admin approval.',
          event
        });
      } else {
        if (event.isRejected) {
          payload.isRejected = false;
          payload.isApproved = false;
        }
        const updated = await eventService.updateEvent(req.params.id, payload);
        return res.json(updated);
      }
    } else {
      return res.status(403).json({ error: 'Forbidden: Only organizers or admins can edit events.' });
    }
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Event ID format' });
    }
    const removed = await eventService.deleteEvent(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
}

async function toggleLike(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Event ID format' });
    }
    const action = req.body?.action === 'unlike' ? 'unlike' : 'like';
    const delta = action === 'unlike' ? -1 : 1;
    const updated = await eventService.adjustLikes(req.params.id, delta);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update user's persistent wishlist using high-performance atomic updates
    if (req.user) {
      if (action === 'like') {
        await UserModel.updateOne(
          { _id: req.user.userId },
          { $addToSet: { wishlist: req.params.id } }
        );
      } else {
        await UserModel.updateOne(
          { _id: req.user.userId },
          { $pull: { wishlist: req.params.id } }
        );
      }
    }

    res.json({ likes: updated.likes, action });
  } catch (err) {
    next(err);
  }
}

async function recordShare(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Event ID format' });
    }
    const updated = await eventService.incrementShares(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ shares: updated.shares });
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
  deleteEvent,
  toggleLike,
  recordShare,
};

