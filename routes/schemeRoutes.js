const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllSchemes,
  getSchemeById,
  getEligibleSchemes,
  compareSchemes,
  syncSchemesFromAPI
} = require('../controllers/schemeController');

// Public routes
router.get('/', getAllSchemes);
router.get('/:id', getSchemeById);

// Protected routes
router.get('/user/eligible', protect, getEligibleSchemes);
router.post('/compare', protect, compareSchemes);

// Admin route - sync from API
router.post('/sync', protect, syncSchemesFromAPI);

module.exports = router;