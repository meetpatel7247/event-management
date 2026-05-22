const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel'); // Ensure User schema is registered for populate

async function listEvents() {
  return await EventModel.find().populate('organizerId', 'name email');
}

/** Returns only events created by this specific organizer */
async function listEventsByOrganizer(organizerId) {
  return await EventModel.find({ organizerId }).populate('organizerId', 'name email');
}

async function findEventById(id) {
  return await EventModel.findById(id).populate('organizerId', 'name email');
}

async function createEvent(payload) {
  return await EventModel.create(payload);
}

async function updateEvent(id, payload) {
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
