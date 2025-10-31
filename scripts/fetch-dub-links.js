const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables using dotenv
(() => {
  const cwd = process.cwd();
  const localEnv = path.join(cwd, '.env.local');
  const defaultEnv = path.join(cwd, '.env');
  const envFile = fs.existsSync(localEnv) ? localEnv : (fs.existsSync(defaultEnv) ? defaultEnv : null);
  if (envFile) {
    dotenv.config({ path: envFile });
  }
})();

async function fetchDubLinks() {
  const url = 'https://api.dub.co/links?showArchived=false&withTags=false&sortBy=createdAt&sortOrder=desc&sort=createdAt&page=1&pageSize=100';
  
  const apiToken = process.env.DUB_API_TOKEN;
  if (!apiToken) {
    console.error('Error: DUB_API_TOKEN environment variable is not set');
    process.exit(1);
  }

  const options = {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    }
  };

  try {
  console.log('Fetching links from Dub API...');
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${Array.isArray(data) ? data.length : 'unknown number of'} links`);

    // Reduce each link to only the required fields
    const keepFields = ['url', 'shortLink', 'archived', 'title', 'description', 'image', 'clicks', 'qrCode'];
    const pick = (obj, keys) => keys.reduce((acc, key) => {
      const value = obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : null;
      acc[key] = value == null ? null : value;
      return acc;
    }, {});
    const reduced = Array.isArray(data) ? data.map((link) => pick(link, keepFields)) : [];

    // Prepare output with metadata
    const output = {
      fetchedAt: new Date().toISOString(),
      count: Array.isArray(reduced) ? reduced.length : null,
      links: reduced
    };

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to file
    const filePath = path.join(dataDir, 'dub-links.json');
    fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
    console.log(`Data saved to ${filePath}`);

  } catch (error) {
    console.error('Error fetching Dub links:', error.message);
    process.exit(1);
  }
}

fetchDubLinks();
