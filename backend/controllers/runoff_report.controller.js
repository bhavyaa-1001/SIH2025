const { spawn } = require('child_process');
const path = require('path');

/**
 * Generate a runoff coefficient report based on latitude and longitude
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateReport = (req, res) => {
  const { latitude, longitude } = req.body;

  // Validate input
  if (!latitude || !longitude) {
    return res.status(400).json({ 
      success: false, 
      error: 'Latitude and longitude are required' 
    });
  }

  // Validate that latitude and longitude are numbers
  if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
    return res.status(400).json({ 
      success: false, 
      error: 'Latitude and longitude must be valid numbers' 
    });
  }

  // Path to the Python script
  const scriptPath = path.join(__dirname, '..', 'scripts', 'generate_runoff_report.py');

  // Spawn a Python process
  const pythonProcess = spawn('python', [
    scriptPath,
    latitude.toString(),
    longitude.toString()
  ]);

  let dataString = '';
  let errorString = '';

  // Collect data from script
  pythonProcess.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  // Collect any error output
  pythonProcess.stderr.on('data', (data) => {
    errorString += data.toString();
  });

  // Handle process completion
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
      console.error(`Error: ${errorString}`);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to generate runoff report',
        details: errorString 
      });
    }

    try {
      // Parse the JSON output from the Python script
      const result = JSON.parse(dataString);
      
      // Check if there was an error in the Python script
      if (result.error) {
        return res.status(400).json({ 
          success: false, 
          error: result.error 
        });
      }

      // Return the report data
      return res.status(200).json({ 
        success: true, 
        data: result 
      });
    } catch (error) {
      console.error('Error parsing Python script output:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to parse runoff report data',
        details: error.message 
      });
    }
  });
};