#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import json
import pandas as pd
import numpy as np
import pickle
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Path to the saved model
model_path = os.path.join(script_dir, 'runoff_model.pkl')

# Load the pre-trained model
try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    print(json.dumps({"error": "Model file not found"}))
    sys.exit(1)

def classify_soil_texture(sand, silt, clay):
    """
    Classify soil texture based on sand, silt, and clay percentages.
    Returns the texture name and encoded value.
    """
    # Define the custom texture class encoding mapping
    custom_texture_encoding = {
        "SANDY LOAM": 10,
        "SANDY CLAY": 5,
        "LOAM": 2,
        "CLAY LOAM": 1,
        "CLAY": 0,
        "SILTY LOAM": 9,
        "LOAMY SAND": 3,
        "SILTY CLAY LOAM": 8,
        "SILTY CLAY": 7,
        "SAND": 4,
        "SANDY CLAY LOAM": 11,
        "Unknown": -1
    }
    
    # Simple classification logic based on percentages
    if sand >= 85:
        texture = "SAND"
    elif sand >= 70 and clay <= 15:
        texture = "LOAMY SAND"
    elif (sand >= 50 and sand < 70) and clay <= 20:
        texture = "SANDY LOAM"
    elif (clay >= 35) and (sand >= 45):
        texture = "SANDY CLAY"
    elif (clay >= 25 and clay < 35) and (sand >= 45):
        texture = "SANDY CLAY LOAM"
    elif (clay >= 25 and clay < 40) and (sand < 45) and (silt < 40):
        texture = "CLAY LOAM"
    elif clay >= 40:
        texture = "CLAY"
    elif (silt >= 80):
        texture = "SILTY LOAM"
    elif (clay >= 40) and (silt >= 40):
        texture = "SILTY CLAY"
    elif (clay >= 25 and clay < 40) and (silt >= 40):
        texture = "SILTY CLAY LOAM"
    elif (silt >= 50 and silt < 80) and clay < 25:
        texture = "SILTY LOAM"
    elif (sand < 50) and (clay < 25) and (silt < 50):
        texture = "LOAM"
    else:
        texture = "Unknown"
    
    return texture, custom_texture_encoding.get(texture, -1)

def predict_runoff_coefficient(lat, lon):
    """
    Predict runoff coefficient based on latitude and longitude.
    This is a simplified version that would normally fetch soil data from an API.
    For this example, we'll use dummy values based on the coordinates.
    """
    # In a real implementation, you would fetch soil data from an API using lat/lon
    # For this example, we'll generate dummy values based on the coordinates
    
    # Generate dummy soil properties based on coordinates
    # This is just for demonstration - in a real app, you'd fetch actual data
    seed = int(abs(lat * 100) + abs(lon * 100))
    np.random.seed(seed)
    
    # Generate soil properties (these would normally come from an API)
    clay_pct = np.clip(np.random.normal(30, 10), 5, 60)
    silt_pct = np.clip(np.random.normal(40, 10), 5, 70)
    sand_pct = 100 - clay_pct - silt_pct
    if sand_pct < 5:
        # Adjust to ensure valid percentages
        diff = 5 - sand_pct
        silt_pct -= diff
        sand_pct = 5
    
    # Organic carbon content
    oc_value = np.clip(np.random.normal(1.5, 0.5), 0.2, 3.0)
    
    # Get texture classification
    texture_name, texture_encoded = classify_soil_texture(sand_pct, silt_pct, clay_pct)
    
    # Prepare features for the model
    soil_features = {
        "Clay": clay_pct,
        "Silt": silt_pct,
        "Sand": sand_pct,
        "Texture Encoded": texture_encoded,
        "OC": oc_value
    }
    
    # Create DataFrame for prediction
    input_data = pd.DataFrame([soil_features])
    
    # Make prediction
    try:
        ksat = model.predict(input_data)[0]
        
        # Calculate runoff coefficient (simplified formula)
        # Higher Ksat means better infiltration, so lower runoff coefficient
        # This is a simplified inverse relationship
        runoff_coef = 1.0 / (1.0 + 0.1 * ksat)
        runoff_coef = np.clip(runoff_coef, 0.1, 0.9)  # Clip to reasonable range
        
        return {
            "runoff_coefficient": round(runoff_coef, 3),
            "ksat": round(ksat, 3),
            "soil_properties": {
                "clay": round(clay_pct, 1),
                "silt": round(silt_pct, 1),
                "sand": round(sand_pct, 1),
                "organic_carbon": round(oc_value, 2),
                "texture": texture_name
            }
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Read input from command line arguments
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Expected 2 arguments: latitude and longitude"}))
        sys.exit(1)
    
    try:
        lat = float(sys.argv[1])
        lon = float(sys.argv[2])
        
        # Get prediction
        result = predict_runoff_coefficient(lat, lon)
        
        # Output as JSON
        print(json.dumps(result))
    except ValueError:
        print(json.dumps({"error": "Invalid latitude or longitude values"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)