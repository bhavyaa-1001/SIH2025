/**
 * ML Analysis API for runoff coefficient calculation
 * This module provides functionality to analyze soil properties and calculate runoff coefficients
 * based on geographical coordinates.
 */

const { spawn } = require('child_process');
const path = require('path');

/**
 * Analyze soil properties and calculate runoff coefficient based on coordinates
 * @param {Object} data - Input data containing latitude and longitude
 * @returns {Promise<Object>} - Analysis results including runoff coefficient and soil properties
 */
const analyzeRunoff = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const { latitude, longitude } = data;
      
      if (!latitude || !longitude) {
        return reject(new Error('Latitude and longitude are required'));
      }

      // Prepare input data for the Python script
      const inputData = JSON.stringify({ latitude, longitude });
      
      // Path to the Python script
      const scriptPath = path.join(__dirname, 'run_model.py');
      
      // Spawn Python process
      const pythonProcess = spawn('python', [scriptPath, inputData]);
      
      let result = '';
      let errorOutput = '';
      
      // Collect data from stdout
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      
      // Collect error data from stderr
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
        }
        
        try {
          const analysisResult = JSON.parse(result);
          resolve(analysisResult);
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error.message}`));
        }
      });
      
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  analyzeRunoff
};