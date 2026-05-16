const userService = require('../services/userService');

async function getMe(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(userService.sanitize(user));
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await userService.getUsers();
    res.json(users.map(userService.sanitize));
  } catch (err) {
    next(err);
  }
}

async function patchMe(req, res, next) {
  try {
    const { name, email, password, currentPassword } = req.body;
    const updated = await userService.updateProfile(req.user.userId, {
      name,
      email,
      password,
      currentPassword,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteMe(req, res, next) {
  try {
    const result = await userService.deleteUser(req.user.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function deleteUserAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMe,
  listUsers,
  patchMe,
  deleteMe,
  deleteUserAdmin,
};
