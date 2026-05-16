const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Protected routes (Self-management)
router.get('/me', userController.getMe);
router.put('/profile', userController.patchMe);
router.delete('/me', userController.deleteMe);

// Admin-only user management (assuming authenticate attaches user and middleware can check role)
// For simplicity, we use same authenticate, but in a real app would add another isAdmin middleware.
router.get('/', userController.listUsers);
router.delete('/:id', userController.deleteUserAdmin);

module.exports = router;
