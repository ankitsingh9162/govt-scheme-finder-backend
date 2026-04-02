const fetchMockSchemes = async () => {
  // Simulating API response
  const mockData = {
    success: true,
    timestamp: new Date().toISOString(),
    source: "Mock Government API",
    schemes: [
      {
        scheme_id: "GOV_2026_001",
        name: "Digital India Scholarship 2026",
        description: "Scholarship for students pursuing technology courses",
        category: "Education",
        scheme_type: "Central",
        ministry: "Ministry of Electronics and IT",
        benefits: "₹10,000 per year for 3 years",
        eligibility: {
          min_age: 18,
          max_age: 25,
          max_income: 500000,
          categories: ["General", "SC", "ST", "OBC"],
          states: []
        },
        documents_required: ["Aadhaar", "Income Certificate", "Educational Certificates"],
        application_link: "https://digitalindia.gov.in/scholarships",
        last_updated: "2026-03-15"
      },
      {
        scheme_id: "GOV_2026_002",
        name: "Startup India Seed Fund 2026",
        description: "Financial support for early-stage startups",
        category: "Startup/MSME",
        scheme_type: "Central",
        ministry: "Ministry of Commerce",
        benefits: "Grant up to ₹20 lakh",
        eligibility: {
          min_age: 21,
          max_age: 45,
          occupations: ["Entrepreneur", "Self-Employed"]
        },
        documents_required: ["Business Plan", "Aadhaar", "PAN Card"],
        application_link: "https://startupindia.gov.in/seed-fund",
        last_updated: "2026-03-15"
      },
      {
        scheme_id: "GOV_2026_003",
        name: "PM Women Entrepreneur Scheme",
        description: "Low-interest loans for women entrepreneurs",
        category: "Women",
        scheme_type: "Central",
        ministry: "Ministry of Women & Child Development",
        benefits: "Loans from ₹5 lakh to ₹50 lakh at 5% interest",
        eligibility: {
          min_age: 21,
          gender: "Female",
          max_income: 1000000
        },
        documents_required: ["Aadhaar", "Business Registration", "Bank Statement"],
        application_link: "https://wcd.nic.in/entrepreneur",
        last_updated: "2026-03-10"
      },
      {
        scheme_id: "GOV_2026_004",
        name: "Kisan Credit Card Plus",
        description: "Enhanced credit facility for farmers",
        category: "Agriculture",
        scheme_type: "Central",
        ministry: "Ministry of Agriculture",
        benefits: "Credit limit up to ₹3 lakh at 4% interest",
        eligibility: {
          min_age: 18,
          occupations: ["Farmer"],
          states: []
        },
        documents_required: ["Land Records", "Aadhaar", "Bank Account"],
        application_link: "https://agricoop.gov.in/kcc",
        last_updated: "2026-03-12"
      },
      {
        scheme_id: "GOV_2026_005",
        name: "Senior Citizens Healthcare Card",
        description: "Free healthcare services for senior citizens",
        category: "Senior Citizens",
        scheme_type: "Central",
        ministry: "Ministry of Health",
        benefits: "Free medical consultations and subsidized medicines",
        eligibility: {
          min_age: 60,
          max_income: 300000
        },
        documents_required: ["Aadhaar", "Age Proof", "Income Certificate"],
        application_link: "https://mohfw.gov.in/senior-healthcare",
        last_updated: "2026-03-08"
      }
    ]
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return mockData;
};

module.exports = {
  fetchMockSchemes
};