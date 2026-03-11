const Scheme = require('../models/Scheme');
const User = require('../models/User');

// Get all schemes with filters
const getAllSchemes = async (req, res) => {
  try {
    const { category, schemeType, search } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (schemeType) {
      query.schemeType = schemeType;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const schemes = await Scheme.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single scheme by ID
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }
    
    res.json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    console.error('Get scheme by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get eligible schemes for logged-in user
const getEligibleSchemes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    const allSchemes = await Scheme.find({ isActive: true });
    
    const eligibleSchemes = allSchemes.filter((scheme) => {
      const eligibility = scheme.eligibility;
      
      if (eligibility.minAge && user.age < eligibility.minAge) return false;
      if (eligibility.maxAge && user.age > eligibility.maxAge) return false;
      if (eligibility.maxIncome && user.income > eligibility.maxIncome) return false;
      if (eligibility.states && eligibility.states.length > 0 && !eligibility.states.includes(user.state)) return false;
      if (eligibility.categories && eligibility.categories.length > 0 && !eligibility.categories.includes(user.category)) return false;
      if (eligibility.gender && user.gender !== eligibility.gender) return false;
      
      return true;
    });
    
    res.json({
      success: true,
      count: eligibleSchemes.length,
      data: eligibleSchemes,
    });
  } catch (error) {
    console.error('Get eligible schemes error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Compare two schemes
const compareSchemes = async (req, res) => {
  try {
    const { schemeId1, schemeId2 } = req.body;
    
    if (!schemeId1 || !schemeId2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide two scheme IDs',
      });
    }
    
    const scheme1 = await Scheme.findById(schemeId1);
    const scheme2 = await Scheme.findById(schemeId2);
    
    if (!scheme1 || !scheme2) {
      return res.status(404).json({
        success: false,
        message: 'One or both schemes not found',
      });
    }
    
    res.json({
      success: true,
      data: {
        scheme1,
        scheme2,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export all functions at the END
module.exports = {
  getAllSchemes,
  getSchemeById,
  getEligibleSchemes,
  compareSchemes,
};
