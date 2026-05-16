const UserModel = require('../models/userModel');
const authService = require('./authService');

function sanitize(user) {
  if (!user) return null;
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function roleAvailability() {
  return {
    admin: !(await UserModel.hasAdmin()),
    organizer: true, // Multiple organizers are allowed
  };
}

async function updateProfile(userId, { name, email, password, currentPassword }) {
  const user = await UserModel.findById(userId).select('+password');
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  if (email && email !== user.email) {
    const exists = await UserModel.findOne({ email });
    if (exists) {
      const err = new Error('Email already in use');
      err.status = 409;
      throw err;
    }
  }

  if (password) {
    if (!currentPassword) {
      const err = new Error('Current password is required to set a new password');
      err.status = 400;
      throw err;
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      const err = new Error('Current password is incorrect');
      err.status = 401;
      throw err;
    }
    user.password = password;
  }

  if (name) user.name = name;
  if (email) user.email = email;

  const updatedUser = await user.save();
  const token = authService.signToken(updatedUser);
  return authService.toPublicUser(updatedUser, token);
}

async function getProfile(userId) {
  return await UserModel.findById(userId).select('-password');
}

async function getUsers() {
  return await UserModel.find().select('-password');
}

async function deleteUser(id) {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  if (!deletedUser) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return { message: 'User deleted' };
}

module.exports = {
  sanitize,
  roleAvailability,
  updateProfile,
  getProfile,
  getUsers,
  deleteUser,
};
