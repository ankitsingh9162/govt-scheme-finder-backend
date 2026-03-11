// backend/services/indiaGovAPI.js

const axios = require('axios');

// Free India.gov.in API endpoints
const INDIA_GOV_API = {
  // PM Kisan API
  pmKisan: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
  
  // Education Schemes
  education: 'https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6',
  
  // Health Schemes
  health: 'https://api.data.gov.in/resource/cd09f109-1f59-4d28-9a9e-e7d3f5f9c6a8',
  
  // All Central Schemes
  centralSchemes: 'https://api.data.gov.in/resource/central-schemes',
};

// Fetch schemes from India.gov.in
const fetchSchemesFromIndiaGov = async () => {
  try {
    const schemes = [];
    
    // Fetch from multiple endpoints
    const endpoints = [
      INDIA_GOV_API.pmKisan,
      INDIA_GOV_API.education,
      INDIA_GOV_API.health,
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint, {
          params: {
            'api-key': '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b',
            format: 'json',
            limit: 100,
          },
        });
        
        if (response.data && response.data.records) {
          schemes.push(...response.data.records);
        }
      } catch (err) {
        console.error(`Error fetching from ${endpoint}:`, err.message);
      }
    }
    
    console.log(`✅ Fetched ${schemes.length} schemes from India.gov.in`);
    return schemes;
  } catch (error) {
    console.error('❌ India.gov.in API Error:', error.message);
    return [];
  }
};

// Transform India.gov.in data to our schema
const transformIndiaGovData = (apiScheme) => {
  return {
    name: apiScheme.scheme_name || apiScheme.title || apiScheme.name,
    description: apiScheme.description || apiScheme.objective || apiScheme.details,
    benefits: apiScheme.benefits || apiScheme.financial_assistance || 'As per scheme guidelines',
    category: mapCategory(apiScheme.category || apiScheme.sector || apiScheme.ministry),
    schemeType: apiScheme.scheme_type === 'State' ? 'State' : 'Central',
    eligibility: {
      minAge: extractAge(apiScheme.eligibility, 'min'),
      maxAge: extractAge(apiScheme.eligibility, 'max'),
      maxIncome: extractIncome(apiScheme.eligibility),
    },
    documents: parseDocuments(apiScheme.documents_required || apiScheme.documents),
    applicationLink: apiScheme.application_url || apiScheme.website || apiScheme.url,
    officialWebsite: apiScheme.official_website || apiScheme.website,
    isActive: true,
  };
};

// Helper functions
const mapCategory = (category) => {
  const categoryMap = {
    'agriculture': 'Agriculture',
    'education': 'Education',
    'health': 'Health',
    'housing': 'Housing',
    'women': 'Women',
    'employment': 'Employment',
    'finance': 'Financial Assistance',
    'farmer': 'Farmers',
    'senior': 'Senior Citizens',
    'youth': 'Employment',
  };
  
  const cat = String(category).toLowerCase();
  for (const [key, value] of Object.entries(categoryMap)) {
    if (cat.includes(key)) return value;
  }
  
  return 'Financial Assistance';
};

const extractAge = (eligibility, type) => {
  if (!eligibility) return null;
  const text = String(eligibility).toLowerCase();
  
  const ageMatch = text.match(/(\d+)\s*(?:years?|yrs?)/gi);
  if (!ageMatch) return null;
  
  const ages = ageMatch.map(m => parseInt(m.match(/\d+/)[0]));
  return type === 'min' ? Math.min(...ages) : Math.max(...ages);
};

const extractIncome = (eligibility) => {
  if (!eligibility) return null;
  const text = String(eligibility).toLowerCase();
  
  // Match patterns like "income below 5 lakh" or "₹500000"
  const incomeMatch = text.match(/(?:below|under|less than|upto)?\s*(?:₹|rs\.?)?\s*(\d+)\s*(?:lakh|lakhs)?/i);
  if (!incomeMatch) return null;
  
  let amount = parseInt(incomeMatch[1]);
  if (text.includes('lakh')) amount *= 100000;
  
  return amount;
};

const parseDocuments = (docs) => {
  if (!docs) return [];
  if (Array.isArray(docs)) return docs;
  
  // Split by comma, semicolon, or newline
  return String(docs)
    .split(/[,;\n]/)
    .map(d => d.trim())
    .filter(Boolean);
};

module.exports = {
  fetchSchemesFromIndiaGov,
  transformIndiaGovData,
};