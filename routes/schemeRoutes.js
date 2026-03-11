const express = require('express');
const router = express.Router();
const {
  getAllSchemes,
  getSchemeById, // Add this
  getEligibleSchemes,
  compareSchemes,
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllSchemes);
router.get('/:id', getSchemeById); // Add this

// Protected routes
router.get('/user/eligible', protect, getEligibleSchemes);
router.post('/compare', protect, compareSchemes);

module.exports = router;