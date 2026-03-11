const axios = require('axios');

// Free APIs
const FREE_APIS = {
  // Data.gov.in
  dataGovIn: {
    url: 'https://api.data.gov.in/resource',
    key: '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b',
  },
  
  // India Portal (No key needed)
  indiaPortal: {
    url: 'https://www.india.gov.in/api/schemes',
  },
  
  // National Portal of India
  nationalPortal: {
    url: 'https://www.digitalindia.gov.in/api/schemes',
  },
};

// Aggregate from all free APIs
const fetchFromAllFreeAPIs = async () => {
  const allSchemes = [];
  
  // 1. Data.gov.in
  try {
    const dataGovResponse = await axios.get(
      'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
      {
        params: {
          'api-key': FREE_APIS.dataGovIn.key,
          format: 'json',
          limit: 50,
        },
      }
    );
    
    if (dataGovResponse.data?.records) {
      allSchemes.push(...dataGovResponse.data.records);
      console.log(`✅ Data.gov.in: ${dataGovResponse.data.records.length} schemes`);
    }
  } catch (error) {
    console.error('Data.gov.in error:', error.message);
  }
  
  // 2. Scholarships.gov.in (Public data)
  try {
    const scholarshipData = await fetchScholarshipData();
    allSchemes.push(...scholarshipData);
    console.log(`✅ Scholarships: ${scholarshipData.length} schemes`);
  } catch (error) {
    console.error('Scholarship API error:', error.message);
  }
  
  // 3. Add more free sources...
  
  return allSchemes;
};

// Scholarship schemes
const fetchScholarshipData = async () => {
  // This is public data from scholarships.gov.in
  const scholarships = [
    {
      scheme_name: 'Post Matric Scholarship for SC Students',
      description: 'Financial assistance to SC students',
      category: 'Education',
      sponsor: 'Central Government',
      eligibility: {
        age_min: 16,
        age_max: 35,
        income_max: 250000,
        social_category: ['SC'],
      },
      benefits: 'Maintenance allowance and tuition fees',
      application_url: 'https://scholarships.gov.in/',
    },
    {
      scheme_name: 'Pre Matric Scholarship for ST Students',
      description: 'Financial assistance to ST students',
      category: 'Education',
      sponsor: 'Central Government',
      eligibility: {
        age_min: 10,
        age_max: 18,
        income_max: 250000,
        social_category: ['ST'],
      },
      benefits: 'Maintenance allowance and books',
      application_url: 'https://scholarships.gov.in/',
    },
    // Add more...
  ];
  
  return scholarships;
};

module.exports = {
  fetchFromAllFreeAPIs,
};