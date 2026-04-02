const express = require('express');
const passport = require('passport'); // ✅ correct
const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Regular routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false 
  }),
  (req, res) => {
    const token = req.user.token;

    res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`);
  }
);

module.exports = router;