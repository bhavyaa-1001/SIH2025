#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import json
import os
import subprocess

def get_runoff_data(latitude, longitude):
    """
    Call the runoff_coefficient.py script with the provided coordinates
    and return the results as a dictionary
    """
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to the runoff_coefficient.py script
    runoff_script = os.path.join(script_dir, 'runoff_coefficient.py')
    
    try:
        # Run the script with the provided coordinates
        result = subprocess.run(
            [sys.executable, runoff_script, str(latitude), str(longitude)],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Parse the JSON output
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        return {"error": f"Script execution failed: {e.stderr}"}
    except json.JSONDecodeError:
        return {"error": "Failed to parse script output"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}

def generate_report(data, latitude, longitude):
    """
    Generate a formatted report from the runoff coefficient data
    """
    if "error" in data:
        return {"error": data["error"]}
    
    # Get interpretation based on runoff coefficient
    runoff = data["runoff_coefficient"]
    interpretation = get_interpretation(runoff)
    
    # Create the report structure
    report = {
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "soil_properties": data["soil_properties"],
        "hydraulic_properties": {
            "ksat": data["ksat"],
            "ksat_unit": "μm/s"
        },
        "runoff": {
            "coefficient": runoff,
            "category": get_runoff_category(runoff),
            "interpretation": interpretation
        }
    }
    
    return report

def get_runoff_category(runoff):
    """
    Get the category of runoff based on the coefficient value
    """
    if runoff < 0.3:
        return "LOW"
    elif runoff < 0.5:
        return "MODERATE"
    elif runoff < 0.7:
        return "HIGH"
    else:
        return "VERY HIGH"

def get_interpretation(runoff):
    """
    Provide an interpretation of the runoff coefficient value
    """
    if runoff < 0.3:
        return "This area has good water infiltration capacity. Soil can absorb most rainfall, reducing surface runoff."
    elif runoff < 0.5:
        return "This area has average water infiltration. Some rainfall will become surface runoff during moderate to heavy precipitation events."
    elif runoff < 0.7:
        return "This area has limited water infiltration capacity. A significant portion of rainfall will become surface runoff, increasing erosion and flooding risks."
    else:
        return "This area has poor water infiltration. Most rainfall will become surface runoff, creating high risks of erosion, flooding, and water quality issues."

if __name__ == "__main__":
    # Check if coordinates were provided
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Expected 2 arguments: latitude and longitude"}))
        sys.exit(1)
    
    try:
        # Get coordinates from command line arguments
        latitude = float(sys.argv[1])
        longitude = float(sys.argv[2])
        
        # Get runoff coefficient data
        data = get_runoff_data(latitude, longitude)
        
        # Generate the report
        report = generate_report(data, latitude, longitude)
        
        # Output as JSON
        print(json.dumps(report))
        
    except ValueError:
        print(json.dumps({"error": "Invalid latitude or longitude values"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
        sys.exit(1)