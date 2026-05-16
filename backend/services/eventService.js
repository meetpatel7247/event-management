const EventModel = require('../models/eventModel');

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

module.exports = {
  listEvents,
  listEventsByOrganizer,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
