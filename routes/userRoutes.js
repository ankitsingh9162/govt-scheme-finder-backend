const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  saveScheme,
  unsaveScheme
} = require('../controllers/userController');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Saved schemes routes
router.post('/save-scheme/:schemeId', saveScheme);
router.delete('/save-scheme/:schemeId', unsaveScheme);

module.exports = router;