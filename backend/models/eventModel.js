const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  date: {
    type: String,
    required: [true, 'Please add a date'],
  },
  time: {
    type: String,
    required: [true, 'Please add a time'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    default: 'General',
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    default: 0,
  },
  vipPrice: {
    type: Number,
    default: 0,
  },
  vvipPrice: {
    type: Number,
    default: 0,
  },
  availableSeats: {
    type: Number,
    default: 100,
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  organizerName: {
     type: String,
     default: 'Vibe Events'
  },
  image: {
    type: String,
    default: null,
  },
  offerMinTickets: {
    type: Number,
    default: 0,
  },
  offerDiscount: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', EventSchema);
