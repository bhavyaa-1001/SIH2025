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
  FormHelperText
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Compliance = () => {
  const [formData, setFormData] = useState({
    location: '',
    roofArea: '',
    infiltrationRate: '',
    rechargePotential: '',
    rechargePitDepth: '',
    rechargePitDiameter: ''
  });

  const [isCompliant, setIsCompliant] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would call an API to check compliance
    // For now, we'll simulate a check
    setIsCompliant(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Regulatory Compliance Check
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Check if your rainwater harvesting system design complies with local regulations.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Location (City/State)"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                helperText="Enter your city or state for location-specific regulations"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Roof Area (m²)"
                name="roofArea"
                type="number"
                value={formData.roofArea}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Infiltration Rate (mm/hr)"
                name="infiltrationRate"
                type="number"
                value={formData.infiltrationRate}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">mm/hr</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Recharge Pit Depth (m)"
                name="rechargePitDepth"
                type="number"
                value={formData.rechargePitDepth}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">m</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Recharge Pit Diameter (m)"
                name="rechargePitDiameter"
                type="number"
                value={formData.rechargePitDiameter}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">m</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Recharge Potential (L)"
                name="rechargePotential"
                type="number"
                value={formData.rechargePotential}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">L</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                CHECK COMPLIANCE
              </Button>
            </Grid>
          </Grid>
        </Box>

        {isCompliant !== null && (
          <Box sx={{ mt: 4, p: 2, bgcolor: isCompliant ? 'success.light' : 'error.light', borderRadius: 1 }}>
            <Typography variant="h6" align="center" color={isCompliant ? 'success.dark' : 'error.dark'}>
              {isCompliant ? (
                <>
                  <CheckCircleOutlineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Your system design complies with local regulations
                </>
              ) : (
                'Your system design does not comply with local regulations'
              )}
            </Typography>
            {isCompliant && (
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                You can proceed with the installation of your rainwater harvesting system.
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Compliance;