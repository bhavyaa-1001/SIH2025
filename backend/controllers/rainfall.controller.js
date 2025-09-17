const axios = require('axios');

exports.getRainfallPrediction = async (req, res) => {
    const { lat, lon } = req.body;

    try {
        // Fetch data from the rainfall API
        const response = await axios.get(`http://localhost:8000?lat=${lat}&lon=${lon}`);
        const rainfallData = response.data;

        // For now, we will return the raw data.
        // In the future, we will process this data with an ML model.
        res.status(200).json(rainfallData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rainfall data', error });
    }
};