const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST!
dotenv.config();

const passport = require('./config/passport');
const { scheduleAutoSync } = require('./services/schemeSyncService'); // Add this

// Import routes
const authRoutes = require('./routes/authRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Add this

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes); // Add this

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Government Scheme Finder API is running!' });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    
    // Start auto-sync after DB connection
    scheduleAutoSync(); // Add this
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err.message);
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});