import React, { useState } from 'react';
import axios from 'axios';

const RunoffCoefficient = ({ mapRef }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const calculateRunoff = async (lat, lng) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/runoff/calculate', {
        latitude: lat,
        longitude: lng
      });
      
      setResult(response.data.data);
    } catch (err) {
      console.error('Error calculating runoff coefficient:', err);
      setError(err.response?.data?.message || 'Failed to calculate runoff coefficient');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e) => {
    if (mapRef && mapRef.current) {
      const map = mapRef.current;
      const { lat, lng } = e.latlng;
      calculateRunoff(lat, lng);
    }
  };

  // Add click event listener to map when component mounts
  React.useEffect(() => {
    if (mapRef && mapRef.current) {
      const map = mapRef.current;
      map.on('click', handleMapClick);
      
      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [mapRef]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Runoff Coefficient</h3>
      
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-md mb-3">
          {error}
        </div>
      )}
      
      {result && !loading && (
        <div className="space-y-2">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Runoff Coefficient:</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {result.runoff_coefficient}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="mb-1"><span className="font-medium">Soil Texture:</span> {result.soil_properties.texture}</p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Clay</div>
                <div className="font-medium">{result.soil_properties.clay}%</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Silt</div>
                <div className="font-medium">{result.soil_properties.silt}%</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Sand</div>
                <div className="font-medium">{result.soil_properties.sand}%</div>
              </div>
            </div>
            <p className="mt-2"><span className="font-medium">Organic Carbon:</span> {result.soil_properties.organic_carbon}%</p>
            <p><span className="font-medium">Ksat:</span> {result.ksat} mm/hr</p>
          </div>
          
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <p>Click anywhere on the map to calculate runoff coefficient for that location.</p>
          </div>
        </div>
      )}
      
      {!result && !loading && !error && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <p>Click on the map to calculate the runoff coefficient for that location.</p>
        </div>
      )}
    </div>
  );
};

export default RunoffCoefficient;