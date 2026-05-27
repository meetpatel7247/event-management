const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel'); // Ensure User schema is registered for populate

async function listEvents(showAll = false) {
  const filter = showAll ? { isRejected: { $ne: true } } : { isApproved: true };
  return await EventModel.find(filter).populate('organizerId', 'name email');
}

/** Returns only events created by this specific organizer */
async function listEventsByOrganizer(organizerId) {
  return await EventModel.find({ organizerId, isRejected: { $ne: true } }).populate('organizerId', 'name email');
}

async function findEventById(id) {
  return await EventModel.findById(id).populate('organizerId', 'name email');
}

async function createEvent(payload) {
  if (payload.title) {
    const cleanTitle = payload.title.trim();
    const exists = await EventModel.findOne({
      title: { $regex: new RegExp(`^${cleanTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
    });
    if (exists) {
      const err = new Error('An event with this title already exists. Please choose a unique title.');
      err.status = 400;
      throw err;
    }
  }
  return await EventModel.create(payload);
}

async function updateEvent(id, payload) {
  if (payload.title) {
    const cleanTitle = payload.title.trim();
    const exists = await EventModel.findOne({
      _id: { $ne: id },
      title: { $regex: new RegExp(`^${cleanTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
    });
    if (exists) {
      const err = new Error('An event with this title already exists. Please choose a unique title.');
      err.status = 400;
      throw err;
    }
  }
  return await EventModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
}

async function deleteEvent(id) {
  return await EventModel.findByIdAndDelete(id);
}

async function adjustLikes(id, delta) {
  const event = await EventModel.findById(id);
  if (!event) return null;
  event.likes = Math.max(0, (event.likes || 0) + delta);
  await event.save();
  return event;
}

async function incrementShares(id) {
  return await EventModel.findByIdAndUpdate(
    id,
    { $inc: { shares: 1 } },
    { new: true, runValidators: true }
  );
}

module.exports = {
  listEvents,
  listEventsByOrganizer,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  adjustLikes,
  incrementShares,
};
