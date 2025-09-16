import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import RunoffCoefficient from './RunoffCoefficient';

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to set map view based on user's location
const SetViewOnClick = ({ coords }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView(coords, 13);
    }
  }, [coords, map]);
  
  return null;
};

const RunoffMap = () => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = React.useState(null);
  
  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a location in India if geolocation fails
          setUserLocation([20.5937, 78.9629]);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Default to a location in India
      setUserLocation([20.5937, 78.9629]);
    }
  }, []);
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-2/3 h-[500px] rounded-lg overflow-hidden shadow-md">
        {userLocation && (
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={userLocation}>
              <Popup>
                Your Location<br />
                Click anywhere on the map to calculate runoff coefficient.
              </Popup>
            </Marker>
            <SetViewOnClick coords={userLocation} />
          </MapContainer>
        )}
      </div>
      
      <div className="w-full md:w-1/3">
        <RunoffCoefficient mapRef={mapRef} />
      </div>
    </div>
  );
};

export default RunoffMap;