const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  saveScheme,
  unsaveScheme,
  getSavedSchemes,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected (require login)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/save-scheme/:schemeId', protect, saveScheme);
router.delete('/save-scheme/:schemeId', protect, unsaveScheme);
router.get('/saved-schemes', protect, getSavedSchemes);

module.exports = router;
