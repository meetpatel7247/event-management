const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied — Admins only' });
  }
};

// Protected routes (Self-management)
router.get('/me', userController.getMe);
router.get('/wishlist', userController.getWishlist);
router.put('/profile', userController.patchMe);
router.delete('/me', userController.deleteMe);

// Admin-only user management
router.get('/', isAdmin, userController.listUsers);
router.put('/:id/approve', isAdmin, userController.approveOrganizer);
router.delete('/:id', isAdmin, userController.deleteUserAdmin);

module.exports = router;
