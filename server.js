const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST!
dotenv.config();

// Passport setup
const passport = require('passport');
require('./config/passport');

// Services
const { scheduleAutoSync } = require('./services/schemeSyncService');

// Import routes
const authRoutes = require('./routes/authRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// ✅ Routes (IMPORTANT)
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.json({ message: 'Government Scheme Finder API is running!' });
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    
    // Start auto-sync
    scheduleAutoSync();
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err.message);
  });

// ✅ Start Server (MOST IMPORTANT)
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});