#!/usr/bin/env python3
import sys
import json
import random
import math

def main():
    """
    Process input data and generate runoff coefficient analysis
    """
    try:
        # Read input data from command line argument
        if len(sys.argv) < 2:
            raise ValueError("No input data provided")
        
        input_data = json.loads(sys.argv[1])
        
        # Extract coordinates
        latitude = input_data.get('latitude')
        longitude = input_data.get('longitude')
        
        if not latitude or not longitude:
            raise ValueError("Latitude and longitude are required")
        
        # Generate soil properties based on coordinates
        soil_properties = generate_soil_properties(latitude, longitude)
        
        # Calculate runoff coefficient
        runoff_coefficient = calculate_runoff_coefficient(soil_properties)
        
        # Prepare response
        response = {
            "runoff_coefficient": runoff_coefficient,
            "ksat": soil_properties["ksat"],
            "soil_properties": {
                "clay": soil_properties["clay"],
                "silt": soil_properties["silt"],
                "sand": soil_properties["sand"],
                "organic_carbon": soil_properties["organic_carbon"],
                "texture": soil_properties["texture"]
            }
        }
        
        # Output JSON result
        print(json.dumps(response))
        
    except Exception as e:
        error_response = {
            "error": str(e)
        }
        print(json.dumps(error_response), file=sys.stderr)
        sys.exit(1)

def generate_soil_properties(latitude, longitude):
    """
    Generate soil properties based on coordinates
    """
    # Use coordinates as seed for reproducible randomness
    seed = abs(float(latitude) * 100) + abs(float(longitude) * 100)
    random.seed(seed)
    
    # Generate soil composition
    clay = min(max(random.uniform(20, 40), 5), 60)
    silt = min(max(random.uniform(30, 50), 5), 70)
    sand = 100 - clay - silt
    if sand < 5:
        sand = 5
        total = clay + silt + sand
        clay = clay * 100 / total
        silt = silt * 100 / total
    
    # Round to 1 decimal place
    clay = round(clay, 1)
    silt = round(silt, 1)
    sand = round(sand, 1)
    
    # Determine soil texture
    texture = determine_soil_texture(clay, silt, sand)
    
    # Generate other properties
    organic_carbon = round(min(max(random.uniform(1.0, 2.0), 0.2), 3.0), 2)
    ksat = round(random.uniform(5, 20), 3)
    
    return {
        "clay": clay,
        "silt": silt,
        "sand": sand,
        "texture": texture,
        "organic_carbon": organic_carbon,
        "ksat": ksat
    }

def determine_soil_texture(clay, silt, sand):
    """
    Determine soil texture based on composition
    """
    if sand >= 85:
        return "SAND"
    elif sand >= 70 and clay <= 15:
        return "LOAMY SAND"
    elif sand >= 50 and sand < 70 and clay <= 20:
        return "SANDY LOAM"
    elif clay >= 35 and sand >= 45:
        return "SANDY CLAY"
    elif clay >= 25 and clay < 35 and sand >= 45:
        return "SANDY CLAY LOAM"
    elif clay >= 25 and clay < 40 and sand < 45 and silt < 40:
        return "CLAY LOAM"
    elif clay >= 40:
        return "CLAY"
    elif silt >= 80:
        return "SILTY LOAM"
    elif clay >= 40 and silt >= 40:
        return "SILTY CLAY"
    elif clay >= 25 and clay < 40 and silt >= 40:
        return "SILTY CLAY LOAM"
    elif silt >= 50 and silt < 80 and clay < 25:
        return "SILTY LOAM"
    elif sand < 50 and clay < 25 and silt < 50:
        return "LOAM"
    else:
        return "UNKNOWN"

def calculate_runoff_coefficient(soil_properties):
    """
    Calculate runoff coefficient based on soil properties
    """
    # Use hydraulic conductivity (ksat) to estimate runoff coefficient
    # Higher ksat = lower runoff coefficient
    ksat = soil_properties["ksat"]
    runoff = 1.0 / (1.0 + 0.1 * ksat)
    
    # Ensure value is between 0 and 1
    runoff = max(0.1, min(0.9, runoff))
    
    # Round to 3 decimal places
    return round(runoff, 3)

if __name__ == "__main__":
    main()