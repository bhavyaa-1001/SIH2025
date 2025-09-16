const axios = require('axios');

// Test coordinates (Delhi, India)
const testCoordinates = {
  latitude: 28.6139,
  longitude: 77.2090
};

// Function to test the runoff report API
async function testRunoffReport() {
  try {
    console.log('Testing runoff coefficient report API...');
    console.log(`Coordinates: Latitude ${testCoordinates.latitude}, Longitude ${testCoordinates.longitude}`);
    
    // Make API request
    const response = await axios.post('http://localhost:5000/api/runoff-report', testCoordinates);
    
    // Check if request was successful
    if (response.data.success) {
      const report = response.data.data;
      
      console.log('\n===== RUNOFF COEFFICIENT REPORT =====\n');
      
      // Location information
      console.log('LOCATION:');
      console.log(`Latitude: ${report.location.latitude}`);
      console.log(`Longitude: ${report.location.longitude}`);
      
      // Soil properties
      console.log('\nSOIL PROPERTIES:');
      console.log(`Texture: ${report.soil_properties.texture}`);
      console.log(`Clay: ${report.soil_properties.clay}%`);
      console.log(`Silt: ${report.soil_properties.silt}%`);
      console.log(`Sand: ${report.soil_properties.sand}%`);
      console.log(`Organic Carbon: ${report.soil_properties.organic_carbon}%`);
      
      // Hydraulic properties
      console.log('\nHYDRAULIC PROPERTIES:');
      console.log(`Ksat: ${report.hydraulic_properties.ksat} ${report.hydraulic_properties.ksat_unit}`);
      
      // Runoff assessment
      console.log('\nRUNOFF ASSESSMENT:');
      console.log(`Coefficient: ${report.runoff.coefficient}`);
      console.log(`Category: ${report.runoff.category} RUNOFF POTENTIAL`);
      
      // Interpretation
      console.log('\nINTERPRETATION:');
      console.log(report.runoff.interpretation);
      
      console.log('\n===================================\n');
      console.log('Test completed successfully!');
    } else {
      console.error('API request failed:', response.data.error);
    }
  } catch (error) {
    console.error('Error testing runoff report API:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testRunoffReport();

// Instructions for running this test:
// 1. Make sure your backend server is running
// 2. Run this script with: node test_runoff_api.js