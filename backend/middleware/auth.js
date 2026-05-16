const jwt = require('jsonwebtoken');

const { ApiError } = require('../common/responseHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-JWT_SECRET-in-production';

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
}

/** Sets req.user when a valid Bearer token is sent; otherwise continues without req.user. */
function optionalAuthenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { userId: payload.sub, role: payload.role };
  } catch {
    // invalid token — treat as anonymous for optional routes
  }
  next();
}

module.exports = { authenticate, optionalAuthenticate, JWT_SECRET };
