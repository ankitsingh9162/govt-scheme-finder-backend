// backend/services/githubDatasets.js

const axios = require('axios');

// Public GitHub dataset URLs
const GITHUB_DATASETS = {
  // Example: Government schemes dataset
  schemes: 'https://raw.githubusercontent.com/datameet/indian-govt-schemes/main/schemes.json',
};

const fetchFromGitHub = async () => {
  try {
    const response = await axios.get(GITHUB_DATASETS.schemes);
    console.log(`✅ GitHub: ${response.data.length} schemes fetched`);
    return response.data;
  } catch (error) {
    console.error('GitHub dataset error:', error.message);
    return [];
  }
};

module.exports = { fetchFromGitHub };