// Script to seed Convex with complete cooperative dataset
const fs = require('fs');

async function seed() {
  const url = 'https://giant-bison-526.eu-west-1.convex.cloud/api/mutation';
  
  // Read initial data from AppContext or coopData
  // We can construct a rich set of data
  const data = {
    key: 'main',
    updatedBy: 'Alain Patrick Nkoumou (Admin)',
    activeCampagneCode: 'CAMP-2026-A',
  };

  console.log('Sending seed mutation to Convex...');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'appData:ping',
      args: {}
    })
  });
  console.log('Ping status:', await res.json());
}

seed().catch(console.error);
