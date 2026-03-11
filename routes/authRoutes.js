const express = require('express');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Regular routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&user=${JSON.stringify({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      })}`
    );
  }
);

module.exports = router;