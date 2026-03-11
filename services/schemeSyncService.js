const cron = require('node-cron');
const Scheme = require('../models/Scheme');
const { fetchSchemesFromIndiaGov, transformIndiaGovData } = require('./indiaGovAPI');
const { fetchFromAllFreeAPIs } = require('./freeAPIsAggregator');

// Sync from free APIs
const syncSchemesFromFreeAPIs = async () => {
  try {
    console.log('🔄 Starting scheme sync from free APIs...');
    
    // Fetch from India.gov.in
    const indiaGovSchemes = await fetchSchemesFromIndiaGov();
    
    // Fetch from other free sources
    const otherSchemes = await fetchFromAllFreeAPIs();
    
    // Combine all schemes
    const allApiSchemes = [...indiaGovSchemes, ...otherSchemes];
    console.log(`📥 Total schemes fetched: ${allApiSchemes.length}`);
    
    let addedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const apiScheme of allApiSchemes) {
      try {
        // Transform to our schema
        const schemeData = transformIndiaGovData(apiScheme);
        
        if (!schemeData.name) {
          console.warn('⚠️ Skipping scheme without name');
          continue;
        }
        
        // Check if exists
        const existingScheme = await Scheme.findOne({ 
          name: { $regex: new RegExp(`^${schemeData.name}$`, 'i') }
        });
        
        if (existingScheme) {
          await Scheme.findByIdAndUpdate(existingScheme._id, schemeData);
          updatedCount++;
        } else {
          await Scheme.create(schemeData);
          addedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing scheme:`, error.message);
        errorCount++;
      }
    }
    
    console.log('✅ Sync completed!');
    console.log(`📊 Added: ${addedCount}, Updated: ${updatedCount}, Errors: ${errorCount}`);
    
    return {
      success: true,
      added: addedCount,
      updated: updatedCount,
      errors: errorCount,
      total: allApiSchemes.length,
    };
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Schedule daily sync
const scheduleAutoSync = () => {
  // Run every day at 3 AM
  cron.schedule('0 3 * * *', async () => {
    console.log('⏰ Running scheduled scheme sync...');
    await syncSchemesFromFreeAPIs();
  });
  
  console.log('✅ Auto-sync scheduled: Daily at 3 AM');
};

module.exports = {
  syncSchemesFromFreeAPIs,
  scheduleAutoSync,
};