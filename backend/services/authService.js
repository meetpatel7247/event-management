const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { JWT_SECRET } = require('../middleware/auth');

const TOKEN_EXPIRY = '7d';

function signToken(user) {
  return jwt.sign(
    { sub: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

function toPublicUser(user, token) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
}

async function register({ email, password, name, role }) {
  if (!email || !password || !name) {
    const err = new Error('Email, password, and name are required');
    err.status = 400;
    throw err;
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // Check if a user with this email (case-insensitive and trimmed) already exists in the system across all roles
  const existingUser = await UserModel.findOne({ email: cleanEmail });
  if (existingUser) {
    const err = new Error('An account with this email already exists. Please use a different email.');
    err.status = 409;
    throw err;
  }

  // Check if a user with this name (case-insensitive and trimmed) already exists in the system across all roles
  const existingName = await UserModel.findOne({ name: { $regex: new RegExp(`^${cleanName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') } });
  if (existingName) {
    const err = new Error('An account with this name already exists. Please choose a unique name.');
    err.status = 409;
    throw err;
  }

  const allowed = ['user', 'organizer', 'admin'];
  const r = allowed.includes(role) ? role : 'user';

  if (r === 'admin' && (await UserModel.hasAdmin())) {
    const err = new Error('Admin account already exists.');
    err.status = 400;
    throw err;
  }

  const user = await UserModel.create({ 
    email: cleanEmail, 
    password, // Hashing is handled by pre-save hook in userModel.js
    name: cleanName, 
    role: r 
  });

  const token = signToken(user);
  return toPublicUser(user, token);
}

async function login(email, password) {
  console.log(`[AUTH] Login attempt for: ${email}`);
  const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    console.warn(`[AUTH] No user found with email: ${email}`);
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const isMatch = await user.matchPassword(password);
  console.log(`[AUTH] Password match for ${email}: ${isMatch}`);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const token = signToken(user);
  return toPublicUser(user, token);
}

module.exports = {
  register,
  login,
  signToken,
  toPublicUser,
};
