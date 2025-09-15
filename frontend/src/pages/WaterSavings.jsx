import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  Paper,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  CircularProgress
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SavingsIcon from '@mui/icons-material/Savings';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';

const WaterSavings = () => {
  const [formData, setFormData] = useState({
    roofArea: '',
    annualRainfall: '',
    runoffCoefficient: '0.8',
    waterPrice: '0.002', // price per liter in currency
    householdSize: '4'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateSavings = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const { roofArea, annualRainfall, runoffCoefficient, waterPrice, householdSize } = formData;
      
      // Calculate potential water collection in liters
      // Formula: Roof Area (m²) × Annual Rainfall (mm) × Runoff Coefficient × 0.001
      const potentialCollection = roofArea * annualRainfall * runoffCoefficient * 0.001;
      
      // Calculate financial savings
      const financialSavings = potentialCollection * waterPrice;
      
      // Calculate water self-sufficiency percentage
      // Average person uses ~150L per day
      const annualHouseholdUsage = householdSize * 150 * 365;
      const selfSufficiencyPercentage = Math.min(100, (potentialCollection / annualHouseholdUsage) * 100);
      
      // Calculate environmental impact (CO2 reduction in kg)
      // Approx 0.3 kg CO2 per 1000L of water
      const environmentalImpact = (potentialCollection / 1000) * 0.3;
      
      setResults({
        potentialCollection: Math.round(potentialCollection),
        financialSavings: financialSavings.toFixed(2),
        selfSufficiencyPercentage: selfSufficiencyPercentage.toFixed(1),
        environmentalImpact: environmentalImpact.toFixed(2)
      });
      
      setLoading(false);
    }, 1500);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Water Savings Calculator
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Estimate how much water and money you can save with your rainwater harvesting system.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box component="form" onSubmit={calculateSavings}>
              <Typography variant="h6" gutterBottom>
                Enter Your Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Roof Area"
                    name="roofArea"
                    type="number"
                    value={formData.roofArea}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Annual Rainfall"
                    name="annualRainfall"
                    type="number"
                    value={formData.annualRainfall}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Runoff Coefficient"
                    name="runoffCoefficient"
                    type="number"
                    value={formData.runoffCoefficient}
                    onChange={handleInputChange}
                    helperText="Typical values: 0.8-0.9 for metal roofs, 0.7-0.8 for tile roofs"
                    inputProps={{ step: 0.1, min: 0, max: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Water Price"
                    name="waterPrice"
                    type="number"
                    value={formData.waterPrice}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      endAdornment: <InputAdornment position="end">/L</InputAdornment>,
                    }}
                    inputProps={{ step: 0.001 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Household Size"
                    name="householdSize"
                    type="number"
                    value={formData.householdSize}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">people</InputAdornment>,
                    }}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Calculate Savings'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: results ? 'space-between' : 'center' }}>
            {results ? (
              <>
                <Typography variant="h6" gutterBottom align="center">
                  Your Estimated Savings
                </Typography>
                
                <Card sx={{ mb: 2, bgcolor: 'primary.light' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <WaterDropIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Annual Water Collection
                      </Typography>
                      <Typography variant="h5" component="div">
                        {results.potentialCollection.toLocaleString()} Liters
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card sx={{ mb: 2, bgcolor: 'success.light' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <SavingsIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Annual Financial Savings
                      </Typography>
                      <Typography variant="h5" component="div">
                        ${results.financialSavings}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalDrinkIcon sx={{ fontSize: 40, mr: 2, color: 'info.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Water Self-Sufficiency
                      </Typography>
                      <Typography variant="h5" component="div">
                        {results.selfSufficiencyPercentage}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Environmental Impact
                  </Typography>
                  <Typography variant="body1" align="center">
                    Your system could reduce CO₂ emissions by approximately {results.environmentalImpact} kg per year.
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <WaterDropIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7, mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Enter your details and calculate to see potential water savings
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WaterSavings;