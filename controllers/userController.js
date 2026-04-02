const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, age, income, state, category, gender, occupation } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (age) user.age = age;
    if (income !== undefined) user.income = income;
    if (state) user.state = state;
    if (category) user.category = category;
    if (gender) user.gender = gender;
    if (occupation !== undefined) user.occupation = occupation;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        income: user.income,
        state: user.state,
        category: user.category,
        gender: user.gender,
        occupation: user.occupation,
        savedSchemes: user.savedSchemes
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Save scheme
const saveScheme = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const schemeId = req.params.schemeId;
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.savedSchemes.includes(schemeId)) {
      return res.status(400).json({ success: false, message: 'Scheme already saved' });
    }
    
    user.savedSchemes.push(schemeId);
    await user.save();
    
    res.json({
      success: true,
      message: 'Scheme saved successfully',
      data: user.savedSchemes
    });
    
  } catch (error) {
    console.error('Save scheme error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Unsave scheme
const unsaveScheme = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const schemeId = req.params.schemeId;
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.savedSchemes = user.savedSchemes.filter(
      id => id.toString() !== schemeId
    );
    await user.save();
    
    res.json({
      success: true,
      message: 'Scheme removed successfully',
      data: user.savedSchemes
    });
    
  } catch (error) {
    console.error('Unsave scheme error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CRITICAL: Export all functions
module.exports = {
  getProfile,
  updateProfile,
  saveScheme,
  unsaveScheme
};