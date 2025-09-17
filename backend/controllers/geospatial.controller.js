const axios = require('axios');

// This is the URL where your Python rainfall API is running.
const RAINFALL_API_URL = process.env.RAINFALL_API_URL || 'http://127.0.0.1:8000';

const getAnnualRainfall = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude (lat) and Longitude (lon) are required.' });
  }

  try {
    const response = await axios.get(RAINFALL_API_URL, {
      params: { lat, lon }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error calling Rainfall API:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: 'Failed to fetch rainfall data from the microservice.',
        details: error.response.data 
      });
    }
    res.status(500).json({ error: 'Internal server error while contacting the rainfall service.' });
  }
};

module.exports = { getAnnualRainfall };