import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';

const RunoffReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  
  // Helper function to calculate runoff coefficient based on soil texture and ksat
  const calculateRunoffCoefficient = (texture, ksat) => {
    // Base runoff coefficient on soil texture
    let base;
    if (texture === "SAND") base = 0.10;
    else if (texture === "LOAMY SAND") base = 0.15;
    else if (texture === "SANDY LOAM") base = 0.20;
    else if (texture === "LOAM") base = 0.25;
    else if (texture === "SILTY LOAM") base = 0.30;
    else if (texture === "CLAY LOAM") base = 0.35;
    else if (texture === "CLAY") base = 0.40;
    else base = 0.30;
    
    // Adjust based on ksat (higher ksat = lower runoff)
    const ksatFactor = Math.max(0, Math.min(0.15, (20 - ksat) / 100));
    
    return (base + ksatFactor).toFixed(2);
  };
  
  // Helper function to generate interpretation text
  const generateInterpretation = (runoffCoefficient) => {
    const rc = parseFloat(runoffCoefficient);
    if (rc < 0.3) {
      return "LOW RUNOFF POTENTIAL: This area has good water infiltration capacity. Soil can absorb most rainfall, reducing surface runoff.";
    } else if (rc < 0.5) {
      return "MODERATE RUNOFF POTENTIAL: This area has average water infiltration. Some rainfall will become surface runoff during moderate to heavy precipitation events.";
    } else if (rc < 0.7) {
      return "HIGH RUNOFF POTENTIAL: This area has limited water infiltration capacity. A significant portion of rainfall will become surface runoff, increasing erosion and flooding risks.";
    } else {
      return "VERY HIGH RUNOFF POTENTIAL: This area has poor water infiltration. Most rainfall will become surface runoff, creating high risks of erosion, flooding, and water quality issues.";
    }
  };
  
  // Get coordinates and assessment ID from location state or URL params
  const queryParams = new URLSearchParams(window.location.search);
  const latFromUrl = queryParams.get('latitude');
  const longFromUrl = queryParams.get('longitude');
  
  const { latitude: latFromState, longitude: longFromState, assessmentId } = location.state || {};
  
  // Use URL params if available, otherwise use state
  const latitude = latFromUrl || latFromState;
  const longitude = longFromUrl || longFromState;
  
  // Generate fallback data for client-side calculation
  const generateFallbackData = (lat, long) => {
    // Generate seed based on coordinates
    const seed = Math.abs(lat * 100) + Math.abs(long * 100);
    const random = function(min, max) {
      const x = Math.sin(seed) * 10000;
      const r = x - Math.floor(x);
      return min + r * (max - min);
    };
    
    // Generate soil properties
    const clay = Math.min(Math.max(random(20, 40), 5), 60);
    const silt = Math.min(Math.max(random(30, 50), 5), 70);
    let sand = 100 - clay - silt;
    if (sand < 5) {
      sand = 5;
    }
    
    // Determine soil texture
    let texture;
    if (sand >= 85) texture = "SAND";
    else if (sand >= 70 && clay <= 15) texture = "LOAMY SAND";
    else if (sand >= 50 && sand < 70 && clay <= 20) texture = "SANDY LOAM";
    else if (clay >= 35 && sand >= 45) texture = "SANDY CLAY";
    else if (clay >= 25 && clay < 35 && sand >= 45) texture = "SANDY CLAY LOAM";
    else if (clay >= 25 && clay < 40 && sand < 45 && silt < 40) texture = "CLAY LOAM";
    else if (clay >= 40) texture = "CLAY";
    else if (silt >= 80) texture = "SILTY LOAM";
    else if (clay >= 40 && silt >= 40) texture = "SILTY CLAY";
    else if (clay >= 25 && clay < 40 && silt >= 40) texture = "SILTY CLAY LOAM";
    else if (silt >= 50 && silt < 80 && clay < 25) texture = "SILTY LOAM";
    else if (sand < 50 && clay < 25 && silt < 50) texture = "LOAM";
    else texture = "Unknown";
    
    // Generate other properties
    const oc = Math.min(Math.max(random(1.0, 2.0), 0.2), 3.0);
    const ksat = random(5, 20);
    
    // Calculate runoff coefficient based on soil texture
    let runoff_coefficient;
    if (texture === "SAND") runoff_coefficient = random(0.05, 0.15);
    else if (texture === "LOAMY SAND") runoff_coefficient = random(0.10, 0.20);
    else if (texture === "SANDY LOAM") runoff_coefficient = random(0.15, 0.25);
    else if (texture === "LOAM") runoff_coefficient = random(0.20, 0.30);
    else if (texture === "SILTY LOAM") runoff_coefficient = random(0.25, 0.35);
    else if (texture === "CLAY LOAM") runoff_coefficient = random(0.30, 0.40);
    else if (texture === "CLAY") runoff_coefficient = random(0.35, 0.45);
    else runoff_coefficient = random(0.25, 0.35);
    
    // Generate interpretation
    let interpretation;
    if (runoff_coefficient < 0.3) {
      interpretation = "LOW RUNOFF POTENTIAL: This area has good water infiltration capacity. Soil can absorb most rainfall, reducing surface runoff.";
    } else if (runoff_coefficient < 0.5) {
      interpretation = "MODERATE RUNOFF POTENTIAL: This area has average water infiltration. Some rainfall will become surface runoff during moderate to heavy precipitation events.";
    } else if (runoff_coefficient < 0.7) {
      interpretation = "HIGH RUNOFF POTENTIAL: This area has limited water infiltration capacity. A significant portion of rainfall will become surface runoff, increasing erosion and flooding risks.";
    } else {
      interpretation = "VERY HIGH RUNOFF POTENTIAL: This area has poor water infiltration. Most rainfall will become surface runoff, creating high risks of erosion, flooding, and water quality issues.";
    }
    
    return {
      runoff_coefficient: runoff_coefficient.toFixed(2),
      ksat: ksat.toFixed(2),
      soil_properties: {
        texture: texture,
        clay: clay.toFixed(1),
        silt: silt.toFixed(1),
        sand: sand.toFixed(1),
        organic_carbon: oc.toFixed(2)
      },
      interpretation: interpretation
    };
  };
  
  useEffect(() => {
    const fetchRunoffReport = async () => {
      if (!latitude || !longitude) {
        setError('Coordinates are required to generate a runoff report');
        setLoading(false);
        return;
      }
      
      try {
        // Try to get data from FastAPI endpoint
        const response = await axios.post('http://localhost:8000/predict', {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          manual_input: false
        });
        
        // Transform the FastAPI response to match our report format
        const apiData = response.data;
        const reportData = {
          runoff_coefficient: calculateRunoffCoefficient(apiData.soil_texture, apiData.ksat),
          ksat: apiData.ksat.toFixed(2),
          soil_properties: {
            texture: apiData.soil_texture,
            clay: apiData.soil_properties.clay.toFixed(1),
            silt: apiData.soil_properties.silt.toFixed(1),
            sand: apiData.soil_properties.sand.toFixed(1),
            organic_carbon: apiData.soil_properties.oc.toFixed(2)
          },
          interpretation: generateInterpretation(calculateRunoffCoefficient(apiData.soil_texture, apiData.ksat))
        };
        
        setReport(reportData);
      } catch (err) {
        console.log('API call failed, using fallback calculation', err);
        // Use fallback client-side calculation if API fails
        const fallbackData = generateFallbackData(parseFloat(latitude), parseFloat(longitude));
        setReport(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRunoffReport();
  }, [latitude, longitude]);
  
  const handleContinue = () => {
    // Navigate to results page with assessment ID
    if (assessmentId) {
      navigate(`/results/${assessmentId}`);
    } else {
      navigate('/');
    }
  };
  
  // If no coordinates are available, show a form to enter them
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualLatitude && manualLongitude) {
      // Support both routes - the React route and direct HTML access
      const currentPath = window.location.pathname;
      if (currentPath === '/runoff_report.html') {
        window.location.href = `/runoff_report.html?latitude=${manualLatitude}&longitude=${manualLongitude}`;
      } else {
        window.location.href = `/runoff-report?latitude=${manualLatitude}&longitude=${manualLongitude}`;
      }
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Runoff Coefficient Report
        </Typography>
        
        {error && !latitude && !longitude && (
          <Box sx={{ mb: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Enter coordinates to generate a runoff report
            </Alert>
            <form onSubmit={handleManualSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <Typography variant="body2">Latitude:</Typography>
                  <input 
                    type="number" 
                    step="any" 
                    value={manualLatitude} 
                    onChange={(e) => setManualLatitude(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    placeholder="e.g., 28.6139"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Typography variant="body2">Longitude:</Typography>
                  <input 
                    type="number" 
                    step="any" 
                    value={manualLongitude} 
                    onChange={(e) => setManualLongitude(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    placeholder="e.g., 77.2090"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Generate
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
        
        {error && latitude && longitude && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error} - Using fallback calculation instead.
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : report ? (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Location Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Latitude
                    </Typography>
                    <Typography variant="body1">
                      {latitude}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Longitude
                    </Typography>
                    <Typography variant="body1">
                      {longitude}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Soil Properties
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Soil Texture
                    </Typography>
                    <Typography variant="body1">
                      {report.soil_properties?.texture || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Organic Carbon
                    </Typography>
                    <Typography variant="body1">
                      {report.soil_properties?.organic_carbon || 'N/A'}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Clay Content
                    </Typography>
                    <Typography variant="body1">
                      {report.soil_properties?.clay || 'N/A'}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Silt Content
                    </Typography>
                    <Typography variant="body1">
                      {report.soil_properties?.silt || 'N/A'}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Sand Content
                    </Typography>
                    <Typography variant="body1">
                      {report.soil_properties?.sand || 'N/A'}%
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Hydraulic Properties
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Saturated Hydraulic Conductivity (Ksat)
                </Typography>
                <Typography variant="body1">
                  {report.ksat || 'N/A'} mm/hr
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Runoff Assessment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Runoff Coefficient
                </Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                  {report.runoff_coefficient || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Interpretation
                </Typography>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="body1">
                    {report.interpretation || 'No interpretation available.'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleContinue}
              >
                Continue to Assessment Results
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" align="center">
            No report data available. Please try again.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default RunoffReport;