const { spawn } = require('child_process');
const path = require('path');

/**
 * Calculate runoff coefficient based on latitude and longitude
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.calculateRunoffCoefficient = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Validate input
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    // Path to Python script
    const scriptPath = path.join(__dirname, '../scripts/runoff_coefficient.py');

    // Spawn Python process
    const pythonProcess = spawn('python', [scriptPath, latitude, longitude]);

    let dataString = '';
    let errorString = '';

    // Collect data from script
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    // Collect errors from script
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
          message: 'Error calculating runoff coefficient',
          error: errorString
        });
      }

      try {
        // Parse the JSON output from Python script
        const result = JSON.parse(dataString);
        
        if (result.error) {
          return res.status(500).json({
            success: false,
            message: 'Error in Python script',
            error: result.error
          });
        }

        return res.status(200).json({
          success: true,
          data: result
        });
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        return res.status(500).json({
          success: false,
          message: 'Error parsing Python output',
          error: parseError.message,
          rawOutput: dataString
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};