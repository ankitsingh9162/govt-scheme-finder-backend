const Scheme = require('../models/Scheme');
const User = require('../models/User');
const { fetchMockSchemes } = require('../services/mockAPIService');

// Get all schemes with filters
const getAllSchemes = async (req, res) => {
  try {
    const { category, search, state } = req.query;
    
    let query = { isActive: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (state) {
      query.$or = [
        { 'eligibility.states': state },
        { 'eligibility.states': { $size: 0 } }
      ];
    }
    
    const schemes = await Scheme.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: schemes.length,
      data: schemes
    });
  } catch (error) {
    console.error('Get all schemes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single scheme by ID
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }
    
    res.json({
      success: true,
      data: scheme
    });
  } catch (error) {
    console.error('Get scheme by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get eligible schemes based on user profile
const getEligibleSchemes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const allSchemes = await Scheme.find({ isActive: true });

    const eligibleSchemes = allSchemes.filter(scheme => {
      const e = scheme.eligibility;

      // Age check
      if (e.minAge && user.age < e.minAge) return false;
      if (e.maxAge && user.age > e.maxAge) return false;

      // Income check
      if (e.maxIncome && user.income > e.maxIncome) return false;

      // State check
      if (e.states?.length > 0 && !e.states.includes(user.state)) return false;

      // Category check
      if (e.categories?.length > 0 && !e.categories.includes(user.category)) return false;

      // Gender check
      if (e.gender && user.gender && e.gender !== user.gender) return false;

      // Occupation check
      if (e.occupations?.length > 0 && user.occupation && 
          !e.occupations.includes(user.occupation)) return false;

      return true; // Passed all filters
    });

    res.json({
      success: true,
      count: eligibleSchemes.length,
      data: eligibleSchemes
    });

  } catch (error) {
    console.error('Get eligible schemes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Compare two schemes
const compareSchemes = async (req, res) => {
  try {
    const { schemeId1, schemeId2 } = req.body;
    
    const scheme1 = await Scheme.findById(schemeId1);
    const scheme2 = await Scheme.findById(schemeId2);
    
    if (!scheme1 || !scheme2) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }
    
    res.json({
      success: true,
      data: {
        scheme1,
        scheme2
      }
    });
  } catch (error) {
    console.error('Compare schemes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Sync schemes from external API
const syncSchemesFromAPI = async (req, res) => {
  try {
    console.log('🔄 Starting scheme synchronization...');

    // Fetch data from mock API
    const apiResponse = await fetchMockSchemes();
    
    let addedCount = 0;
    let updatedCount = 0;

    // Process each scheme from API
    for (const apiScheme of apiResponse.schemes) {
      // Check if scheme already exists
      const existingScheme = await Scheme.findOne({ 
        name: apiScheme.name 
      });

      if (existingScheme) {
        // Update existing scheme
        existingScheme.description = apiScheme.description;
        existingScheme.benefits = apiScheme.benefits;
        existingScheme.category = apiScheme.category;
        existingScheme.schemeType = apiScheme.scheme_type;
        existingScheme.documents = apiScheme.documents_required || [];
        existingScheme.applicationLink = apiScheme.application_link;
        
        // Update eligibility
        existingScheme.eligibility = {
          minAge: apiScheme.eligibility.min_age || null,
          maxAge: apiScheme.eligibility.max_age || null,
          maxIncome: apiScheme.eligibility.max_income || null,
          gender: apiScheme.eligibility.gender || null,
          states: apiScheme.eligibility.states || [],
          categories: apiScheme.eligibility.categories || [],
          occupations: apiScheme.eligibility.occupations || [],
          requiresDisability: false,
          requiresMinority: false
        };

        await existingScheme.save();
        updatedCount++;
      } else {
        // Create new scheme
        const newScheme = new Scheme({
          name: apiScheme.name,
          description: apiScheme.description,
          benefits: apiScheme.benefits,
          category: apiScheme.category,
          schemeType: apiScheme.scheme_type,
          documents: apiScheme.documents_required || [],
          applicationLink: apiScheme.application_link,
          eligibility: {
            minAge: apiScheme.eligibility.min_age || null,
            maxAge: apiScheme.eligibility.max_age || null,
            maxIncome: apiScheme.eligibility.max_income || null,
            gender: apiScheme.eligibility.gender || null,
            states: apiScheme.eligibility.states || [],
            categories: apiScheme.eligibility.categories || [],
            occupations: apiScheme.eligibility.occupations || [],
            requiresDisability: false,
            requiresMinority: false
          },
          isActive: true
        });

        await newScheme.save();
        addedCount++;
      }
    }

    console.log(`✅ Sync complete: ${addedCount} added, ${updatedCount} updated`);

    res.json({
      success: true,
      message: 'Schemes synchronized successfully',
      stats: {
        added: addedCount,
        updated: updatedCount,
        total: apiResponse.schemes.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Sync error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sync failed',
      error: error.message 
    });
  }
};

module.exports = {
  getAllSchemes,
  getSchemeById,
  getEligibleSchemes,
  compareSchemes,
  syncSchemesFromAPI
};