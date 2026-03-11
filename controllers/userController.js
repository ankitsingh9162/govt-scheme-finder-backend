const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.age = req.body.age || user.age;
      user.income = req.body.income || user.income;
      user.state = req.body.state || user.state;
      user.district = req.body.district || user.district;
      user.category = req.body.category || user.category;
      user.occupation = req.body.occupation || user.occupation;
      user.gender = req.body.gender || user.gender;
      user.disability = req.body.disability !== undefined ? req.body.disability : user.disability;
      user.minority = req.body.minority !== undefined ? req.body.minority : user.minority;

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          age: updatedUser.age,
          income: updatedUser.income,
          state: updatedUser.state,
          district: updatedUser.district,
          category: updatedUser.category,
          occupation: updatedUser.occupation,
          gender: updatedUser.gender,
          disability: updatedUser.disability,
          minority: updatedUser.minority,
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save a scheme to user's saved list
// @route   POST /api/user/save-scheme/:schemeId
// @access  Private
const saveScheme = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Check if scheme is already saved
      if (user.savedSchemes.includes(req.params.schemeId)) {
        return res.status(400).json({ message: 'Scheme already saved' });
      }

      user.savedSchemes.push(req.params.schemeId);
      await user.save();

      res.json({
        success: true,
        message: 'Scheme saved successfully',
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a scheme from user's saved list
// @route   DELETE /api/user/save-scheme/:schemeId
// @access  Private
const unsaveScheme = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.savedSchemes = user.savedSchemes.filter(
        (id) => id.toString() !== req.params.schemeId
      );
      await user.save();

      res.json({
        success: true,
        message: 'Scheme removed from saved list',
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved schemes
// @route   GET /api/user/saved-schemes
// @access  Private
const getSavedSchemes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedSchemes');

    if (user) {
      res.json({
        success: true,
        count: user.savedSchemes.length,
        data: user.savedSchemes,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  saveScheme,
  unsaveScheme,
  getSavedSchemes,
};
