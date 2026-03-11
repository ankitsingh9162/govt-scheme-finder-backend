const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const { syncSchemesFromFreeAPIs } = require('../services/schemeSyncService');
const { protect } = require('../middleware/authMiddleware');

// Manual sync trigger (protected - only admin)
router.post('/sync-schemes', protect, async (req, res) => {
  try {
    // TODO: Add admin role check here in future
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Admin access required' });
    // }
    
    console.log('🔄 Manual sync triggered by:', req.user.email);
    
    const result = await syncSchemesFromFreeAPIs();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Schemes synced successfully from free APIs',
        stats: {
          added: result.added,
          updated: result.updated,
          errors: result.errors,
          total: result.total,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Sync failed',
        error: result.error,
      });
    }
  } catch (error) {
    console.error('❌ Admin sync error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get sync status/history
router.get('/sync-status', protect, async (req, res) => {
  try {
    const totalSchemes = await Scheme.countDocuments();
    const activeSchemes = await Scheme.countDocuments({ isActive: true });
    const lastUpdated = await Scheme.findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt name');
    
    // Get schemes by category
    const schemesByCategory = await Scheme.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    // Get schemes by type
    const schemesByType = await Scheme.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$schemeType', count: { $sum: 1 } } },
    ]);
    
    res.json({
      success: true,
      totalSchemes,
      activeSchemes,
      inactiveSchemes: totalSchemes - activeSchemes,
      lastUpdated: {
        time: lastUpdated?.updatedAt,
        schemeName: lastUpdated?.name,
      },
      statistics: {
        byCategory: schemesByCategory,
        byType: schemesByType,
      },
    });
  } catch (error) {
    console.error('❌ Sync status error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all schemes (admin view with filters)
router.get('/schemes', protect, async (req, res) => {
  try {
    const { category, schemeType, isActive, search, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = {};
    
    if (category) query.category = category;
    if (schemeType) query.schemeType = schemeType;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const schemes = await Scheme.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalCount = await Scheme.countDocuments(query);
    
    res.json({
      success: true,
      count: schemes.length,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      data: schemes,
    });
  } catch (error) {
    console.error('❌ Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update a scheme (admin only)
router.put('/schemes/:id', protect, async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }
    
    const updatedScheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    console.log(`✅ Scheme updated by ${req.user.email}:`, updatedScheme.name);
    
    res.json({
      success: true,
      message: 'Scheme updated successfully',
      data: updatedScheme,
    });
  } catch (error) {
    console.error('❌ Update scheme error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete a scheme (admin only)
router.delete('/schemes/:id', protect, async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }
    
    await Scheme.findByIdAndDelete(req.params.id);
    
    console.log(`🗑️ Scheme deleted by ${req.user.email}:`, scheme.name);
    
    res.json({
      success: true,
      message: 'Scheme deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete scheme error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Toggle scheme active status
router.patch('/schemes/:id/toggle-active', protect, async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }
    
    scheme.isActive = !scheme.isActive;
    await scheme.save();
    
    console.log(`🔄 Scheme ${scheme.isActive ? 'activated' : 'deactivated'}:`, scheme.name);
    
    res.json({
      success: true,
      message: `Scheme ${scheme.isActive ? 'activated' : 'deactivated'} successfully`,
      data: scheme,
    });
  } catch (error) {
    console.error('❌ Toggle active error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create new scheme manually
router.post('/schemes', protect, async (req, res) => {
  try {
    const newScheme = await Scheme.create(req.body);
    
    console.log(`➕ New scheme created by ${req.user.email}:`, newScheme.name);
    
    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: newScheme,
    });
  } catch (error) {
    console.error('❌ Create scheme error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message),
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get database statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const totalSchemes = await Scheme.countDocuments();
    const activeSchemes = await Scheme.countDocuments({ isActive: true });
    
    // Schemes added in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSchemes = await Scheme.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    
    // Schemes updated in last 7 days
    const recentUpdates = await Scheme.countDocuments({
      updatedAt: { $gte: sevenDaysAgo },
    });
    
    res.json({
      success: true,
      stats: {
        totalSchemes,
        activeSchemes,
        inactiveSchemes: totalSchemes - activeSchemes,
        recentlyAdded: recentSchemes,
        recentlyUpdated: recentUpdates,
      },
    });
  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
