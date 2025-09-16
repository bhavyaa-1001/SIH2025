from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xgboost as xgb
import pandas as pd
import numpy as np
import pickle
import os
import sys
import requests

# Add the parent directory to sys.path to import from untitled3.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Create FastAPI app
app = FastAPI(title="Soil Model API", description="API for soil texture prediction and Ksat calculation")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Define the custom texture class encoding mapping
custom_texture_encoding = {
    "SANDY LOAMY": 6,
    "SANDY CLAY": 5,
    "LOAM": 2,
    "CLAY LOAM": 1,
    "CLAY": 0,
    "SILTY LOAM": 9,
    "LOAMY SAND": 3,
    "SILTY CLAY LOAM": 8,
    "SILTY CLAY": 7,
    "SAND": 4,
    "SANDY LOAM": 10,
    "SANDY CLAY LOAM": 11,
    "Unknown": -1
}

def classify_soil_texture(sand_pct, silt_pct, clay_pct):
    """
    Classifies soil texture based on sand, silt, and clay percentages
    using a simplified version of the USDA texture triangle rules and
    returns the texture name and its numerical encoding based on a custom mapping.
    """
    if silt_pct + clay_pct < 20:
        texture_name = "SAND"
    elif sand_pct > 52 and silt_pct < 50 and clay_pct < 20:
        texture_name = "LOAMY SAND"
    elif sand_pct > 52 and (silt_pct >= 50 or (silt_pct < 50 and clay_pct >= 20)):
         texture_name = "SANDY LOAM"
    elif silt_pct >= 80 and clay_pct < 12:
        texture_name = "SILT"
    elif silt_pct >= 50 and (clay_pct >= 12 and clay_pct < 27):
        texture_name = "SILT LOAM"
    elif clay_pct >= 27 and sand_pct <= 45:
        texture_name = "CLAY LOAM"
    elif clay_pct >= 20 and clay_pct < 27 and silt_pct >= 28 and silt_pct < 50 and sand_pct <= 52:
         texture_name = "LOAM"
    elif clay_pct >= 35 and sand_pct > 45:
        texture_name = "SANDY CLAY"
    elif clay_pct >= 35 and silt_pct > 40:
         texture_name = "SILTY CLAY"
    elif clay_pct >= 27 and clay_pct < 40 and sand_pct > 45:
         texture_name = "SANDY CLAY LOAM"
    elif clay_pct >= 27 and clay_pct < 40 and silt_pct > 28 and sand_pct <= 45:
         texture_name = "SILTY CLAY LOAM"
    else:
        texture_name = "Unknown"

    texture_encoded = custom_texture_encoding.get(texture_name, custom_texture_encoding["Unknown"])
    return texture_name, texture_encoded

def convert_to_percent(value):
    """Convert SoilGrids sand/silt/clay (0-1000) to %"""
    return value / 10.0

def convert_ocd(ocd_value):
    """Convert OCD to a simplified OC value"""
    return ocd_value * 0.001

def get_soil_data(lat, lon):
    """Fetch soil data from SoilGrids API"""
    rest_url = "https://rest.isric.org"
    prop_query_url = f"{rest_url}/soilgrids/v2.0/properties/query"
    
    point = {"lat": lat, "lon": lon}
    
    properties_to_query = [
        {"property": "sand", "depth": "0-5cm", "value": "mean"},
        {"property": "silt", "depth": "0-5cm", "value": "mean"},
        {"property": "clay", "depth": "0-5cm", "value": "mean"},
        {"property": "ocd",  "depth": "0-5cm", "value": "mean"},
    ]
    
    soil_results = {}
    for prop in properties_to_query:
        try:
            res = requests.get(prop_query_url, params={**point, **prop})
            data = res.json()
            values = data['properties']["layers"][0]["depths"][0]["values"]
            if 'mean' in values and values['mean'] is not None:
                soil_results[prop['property']] = values['mean']
            else:
                soil_results[prop['property']] = 0
        except Exception as e:
            soil_results[prop['property']] = 0
    
    return soil_results

# Load the model
try:
    model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "model.pkl")
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
    else:
        # If model doesn't exist, we'll need to train it or raise an error
        raise FileNotFoundError(f"Model file not found at {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    # We'll handle this in the endpoint

# Define input model for prediction
class SoilInput(BaseModel):
    latitude: float
    longitude: float
    manual_input: bool = False
    clay: float = None
    silt: float = None
    sand: float = None
    oc: float = None

@app.get("/")
def read_root():
    return {"message": "Soil Model API is running"}

@app.post("/predict")
async def predict(soil_input: SoilInput):
    try:
        if soil_input.manual_input:
            # Use manually provided values
            if soil_input.clay is None or soil_input.silt is None or soil_input.sand is None or soil_input.oc is None:
                raise HTTPException(status_code=400, detail="Manual input requires clay, silt, sand, and oc values")
            
            clay_pct = soil_input.clay
            silt_pct = soil_input.silt
            sand_pct = soil_input.sand
            oc_value = soil_input.oc
        else:
            # Fetch from SoilGrids API
            soil_data = get_soil_data(soil_input.latitude, soil_input.longitude)
            
            # Convert to percentages
            sand_value = soil_data.get('sand', 0)
            silt_value = soil_data.get('silt', 0)
            clay_value = soil_data.get('clay', 0)
            ocd_value = soil_data.get('ocd', 0)
            
            sand_pct = convert_to_percent(sand_value)
            silt_pct = convert_to_percent(silt_value)
            clay_pct = convert_to_percent(clay_value)
            oc_value = convert_ocd(ocd_value)
        
        # Get texture classification
        texture_name, texture_encoded = classify_soil_texture(sand_pct, silt_pct, clay_pct)
        
        # Prepare features for model
        soil_features = {
            "Clay": clay_pct,
            "Silt": silt_pct,
            "Sand": sand_pct,
            "Texture Encoded": texture_encoded,
            "OC": oc_value
        }
        
        # Create DataFrame for prediction
        input_data = pd.DataFrame([soil_features])
        
        # Check if model is loaded
        if 'model' not in globals() or model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Make prediction
        ksat = model.predict(input_data)[0]
        
        return {
            "ksat": float(ksat),
            "soil_texture": texture_name,
            "soil_properties": {
                "clay": float(clay_pct),
                "silt": float(silt_pct),
                "sand": float(sand_pct),
                "oc": float(oc_value)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)