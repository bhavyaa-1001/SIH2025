#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import subprocess
import json
import os

def get_runoff_coefficient(latitude, longitude):
    """
    Submit coordinates to the runoff_coefficient.py script and get the results
    """
    script_path = os.path.join('sih-project', 'backend', 'scripts', 'runoff_coefficient.py')
    
    try:
        # Run the script with the provided coordinates
        result = subprocess.run(
            [sys.executable, script_path, str(latitude), str(longitude)],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Parse the JSON output
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error running script: {e}")
        if e.stderr:
            print(f"Error details: {e.stderr}")
        return {"error": "Failed to run the script"}
    except json.JSONDecodeError:
        print(f"Error parsing JSON output: {result.stdout}")
        return {"error": "Failed to parse script output"}

def generate_report(data):
    """
    Generate a formatted report from the runoff coefficient data
    """
    if "error" in data:
        return f"ERROR: {data['error']}"
    
    # Extract data
    runoff = data["runoff_coefficient"]
    ksat = data["ksat"]
    soil = data["soil_properties"]
    
    # Format the report
    report = """
=================================================
           RUNOFF COEFFICIENT REPORT
=================================================

LOCATION INFORMATION:
---------------------
Latitude: {latitude}
Longitude: {longitude}

SOIL PROPERTIES:
----------------
Soil Texture: {texture}
Clay Content: {clay}%
Silt Content: {silt}%
Sand Content: {sand}%
Organic Carbon: {oc}%

HYDRAULIC PROPERTIES:
--------------------
Saturated Hydraulic Conductivity (Ksat): {ksat} μm/s

RUNOFF ASSESSMENT:
-----------------
Runoff Coefficient: {runoff}

INTERPRETATION:
--------------
{interpretation}

=================================================
""".format(
        latitude=latitude,
        longitude=longitude,
        texture=soil["texture"],
        clay=soil["clay"],
        silt=soil["silt"],
        sand=soil["sand"],
        oc=soil["organic_carbon"],
        ksat=ksat,
        runoff=runoff,
        interpretation=get_interpretation(runoff)
    )
    
    return report

def get_interpretation(runoff):
    """
    Provide an interpretation of the runoff coefficient value
    """
    if runoff < 0.3:
        return "LOW RUNOFF POTENTIAL: This area has good water infiltration capacity. Soil can absorb most rainfall, reducing surface runoff."
    elif runoff < 0.5:
        return "MODERATE RUNOFF POTENTIAL: This area has average water infiltration. Some rainfall will become surface runoff during moderate to heavy precipitation events."
    elif runoff < 0.7:
        return "HIGH RUNOFF POTENTIAL: This area has limited water infiltration capacity. A significant portion of rainfall will become surface runoff, increasing erosion and flooding risks."
    else:
        return "VERY HIGH RUNOFF POTENTIAL: This area has poor water infiltration. Most rainfall will become surface runoff, creating high risks of erosion, flooding, and water quality issues."

if __name__ == "__main__":
    # Check if coordinates were provided
    if len(sys.argv) != 3:
        print("Usage: python test_runoff_report.py <latitude> <longitude>")
        sys.exit(1)
    
    try:
        # Get coordinates from command line arguments
        latitude = float(sys.argv[1])
        longitude = float(sys.argv[2])
        
        # Get runoff coefficient data
        data = get_runoff_coefficient(latitude, longitude)
        
        # Generate and print the report
        report = generate_report(data)
        print(report)
        
    except ValueError:
        print("Error: Latitude and longitude must be valid numbers")
        sys.exit(1)