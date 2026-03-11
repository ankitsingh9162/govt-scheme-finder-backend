const axios = require('axios');

// MyScheme API Configuration
const MY_SCHEME_API = {
  baseURL: 'https://api.myscheme.gov.in/v1',
  apiKey: process.env.MYSCHEME_API_KEY, // Add to .env
};

// Fetch all schemes from MyScheme
const fetchAllSchemesFromMyScheme = async () => {
  try {
    const response = await axios.get(`${MY_SCHEME_API.baseURL}/schemes`, {
      headers: {
        'Authorization': `Bearer ${MY_SCHEME_API.apiKey}`,
        'Content-Type': 'application/json',
      },
      params: {
        limit: 1000, // Fetch all
        status: 'active',
      },
    });

    return response.data.schemes || [];
  } catch (error) {
    console.error('❌ MyScheme API Error:', error.message);
    throw error;
  }
};

// Transform MyScheme data to our schema
const transformSchemeData = (apiScheme) => {
  return {
    name: apiScheme.scheme_name,
    description: apiScheme.short_description || apiScheme.description,
    benefits: apiScheme.benefits,
    category: mapCategory(apiScheme.category),
    schemeType: apiScheme.sponsor === 'Central Government' ? 'Central' : 'State',
    eligibility: {
      minAge: apiScheme.eligibility?.age_min,
      maxAge: apiScheme.eligibility?.age_max,
      minIncome: apiScheme.eligibility?.income_min,
      maxIncome: apiScheme.eligibility?.income_max,
      states: apiScheme.applicable_states || [],
      categories: mapSocialCategories(apiScheme.eligibility?.social_category),
      gender: apiScheme.eligibility?.gender,
      occupations: apiScheme.eligibility?.occupation || [],
    },
    documents: apiScheme.required_documents || [],
    applicationLink: apiScheme.apply_url,
    officialWebsite: apiScheme.official_website,
    isActive: true,
  };
};

// Map MyScheme categories to our categories
const mapCategory = (apiCategory) => {
  const categoryMap = {
    'Healthcare': 'Health',
    'Education and Learning': 'Education',
    'Women and Child': 'Women',
    'Agriculture': 'Agriculture',
    'Housing': 'Housing',
    'Employment': 'Employment',
    'Financial Assistance': 'Financial Assistance',
    'Senior Citizens': 'Senior Citizens',
    'Startup': 'Startup/MSME',
    // Add more mappings as needed
  };
  
  return categoryMap[apiCategory] || 'Financial Assistance';
};

// Map social categories
const mapSocialCategories = (apiCategories) => {
  if (!apiCategories) return ['General', 'OBC', 'SC', 'ST', 'EWS'];
  
  const categoryMap = {
    'SC': 'SC',
    'ST': 'ST',
    'OBC': 'OBC',
    'EWS': 'EWS',
    'General': 'General',
  };
  
  return apiCategories.map(cat => categoryMap[cat] || 'General');
};

module.exports = {
  fetchAllSchemesFromMyScheme,
  transformSchemeData,
};