import React, { useState } from 'react';
import axios from 'axios';

const Rainfall = () => {
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handlePrediction = async () => {
        try {
            const response = await axios.post('/api/rainfall/predict', { lat, lon });
            setPrediction(response.data);
            setError(null);
        } catch (err) {
            setError('Error fetching prediction');
            setPrediction(null);
        }
    };

    return (
        <div>
            <h2>Rainfall Prediction</h2>
            <div>
                <input
                    type="text"
                    placeholder="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Longitude"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                />
                <button onClick={handlePrediction}>Get Prediction</button>
            </div>
            {prediction && (
                <div>
                    <h3>Prediction Results</h3>
                    <p>Annual Rainfall: {prediction.annual_rainfall} mm</p>
                </div>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export default Rainfall;