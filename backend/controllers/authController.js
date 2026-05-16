const { catchAsync, ApiError } = require('../common/responseHandler');
const authService = require('../services/authService');
const userService = require('../services/userService');

const register = catchAsync(async (req, res) => {
  const { email, password, name, role } = req.body;
  const user = await authService.register({ email, password, name, role });
  res.status(201).json(user);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }
  const user = await authService.login(email, password);
  res.status(200).json(user);
});

const roleAvailability = catchAsync(async (req, res) => {
  const availability = await userService.roleAvailability();
  res.status(200).json(availability);
});

module.exports = {
  register,
  login,
  roleAvailability,
};
