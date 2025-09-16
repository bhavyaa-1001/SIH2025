import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Chip,
  IconButton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { assessmentService } from '../services/api';
import axios from 'axios';

const steps = ['Property Details', 'System Specifications', 'User Preferences'];

const Assessment = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [formData, setFormData] = useState({
    // Property Details
    location: '',
    coordinates: {
      latitude: null,
      longitude: null
    },
    propertyType: '',
    roofArea: '',
    soilType: '',
    annualRainfall: '',
    roofImage: null,
    
    // System Specifications
    systemType: '',
    storageCapacity: '',
    filtrationSystem: '',
    rechargePit: {
      depth: '',
      diameter: ''
    },
    
    // User Preferences
    userContext: {
      expertise: 'Beginner',
      interests: [],
      preferredLanguage: 'English'
    }
  });
  
  // Geolocation functions
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          coordinates: {
            latitude,
            longitude
          },
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        });
        setLocationLoading(false);

        // Optionally, you can reverse geocode to get the address
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Using BigDataCloud for detailed administrative information
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();

      if (data) {
        // Extract administrative hierarchy
        const addressComponents = {
          state: data.principalSubdivision || data.countrySubdivision || '',
          district: data.locality || data.city || '',
          block: data.localityInfo?.administrative?.[3]?.name ||
                 data.localityInfo?.administrative?.[2]?.name ||
                 data.postcode || '',
          city: data.city || data.locality || data.localityInfo?.administrative?.[1]?.name || ''
        };

        // Try alternative API for better administrative division data
        await enhanceWithNominatimData(latitude, longitude, addressComponents);

        // Format the comprehensive address
        const formattedLocation = formatComprehensiveAddress(addressComponents);

        setFormData(prev => ({
          ...prev,
          location: formattedLocation,
          addressComponents: addressComponents // Store components separately for potential future use
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Keep the coordinates as location if reverse geocoding fails
    }
  };

  const enhanceWithNominatimData = async (latitude, longitude, addressComponents) => {
    try {
      // Use Nominatim (OpenStreetMap) for better administrative division data
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      const nominatimData = await nominatimResponse.json();

      if (nominatimData && nominatimData.address) {
        const addr = nominatimData.address;

        // Extract administrative levels with fallbacks
        addressComponents.state = addressComponents.state ||
                                 addr.state ||
                                 addr.state_district ||
                                 addr.region || '';

        addressComponents.district = addressComponents.district ||
                                   addr.state_district ||
                                   addr.county ||
                                   addr.district ||
                                   addr.city_district || '';

        addressComponents.block = addressComponents.block ||
                                addr.suburb ||
                                addr.neighbourhood ||
                                addr.quarter ||
                                addr.city_block ||
                                addr.postcode || '';

        addressComponents.city = addressComponents.city ||
                               addr.city ||
                               addr.town ||
                               addr.village ||
                               addr.municipality || '';
      }
    } catch (error) {
      console.error('Nominatim geocoding failed:', error);
      // Continue with existing data if Nominatim fails
    }
  };

  const formatComprehensiveAddress = (components) => {
    // Clean and filter non-empty components
    const cleanComponent = (str) => {
      if (!str) return '';
      return str.trim().replace(/^\d+$/, ''); // Remove pure numeric strings (postcodes)
    };

    const state = cleanComponent(components.state);
    const district = cleanComponent(components.district);
    const block = cleanComponent(components.block);
    const city = cleanComponent(components.city);

    // Build hierarchical address array, avoiding duplicates
    const addressParts = [];
    const addedParts = new Set();

    // Add components in order: City, Block, District, State
    [city, block, district, state].forEach(part => {
      if (part && !addedParts.has(part.toLowerCase())) {
        addressParts.push(part);
        addedParts.add(part.toLowerCase());
      }
    });

    // Format as "City, Block, District, State" or fallback to available parts
    if (addressParts.length > 0) {
      return addressParts.join(', ');
    }

    // Fallback to coordinates if no address components found
    return `${formData.coordinates.latitude.toFixed(6)}, ${formData.coordinates.longitude.toFixed(6)}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleNestedInputChange = (e) => {
    const { name, value } = e.target;
    const [parent, child, grandchild] = name.split('.');
    
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [child]: {
          ...formData[parent][child],
          [grandchild]: value
        }
      }
    });
  };
  
  const handleInterestChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      userContext: {
        ...formData.userContext,
        interests: value
      }
    });
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        roofImage: e.target.files[0]
      });
    }
  };
  
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convert string values to numbers
      const payload = {
        ...formData,
        roofArea: Number(formData.roofArea),
        annualRainfall: Number(formData.annualRainfall),
        storageCapacity: formData.storageCapacity ? Number(formData.storageCapacity) : undefined,
        rechargePit: {
          depth: Number(formData.rechargePit.depth),
          diameter: Number(formData.rechargePit.diameter)
        },
        coordinates: formData.coordinates.latitude && formData.coordinates.longitude ? {
          latitude: formData.coordinates.latitude,
          longitude: formData.coordinates.longitude
        } : null
      };

      const response = await axios.post('/api/assessments', payload);

      // Navigate to results page with assessment ID
      navigate(`/results/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while submitting the assessment');
    } finally {
      setLoading(false);
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Property Location
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    multiline
                    maxRows={3}
                    helperText={
                      formData.coordinates.latitude && formData.coordinates.longitude
                        ? `Auto-detected coordinates: ${formData.coordinates.latitude.toFixed(6)}, ${formData.coordinates.longitude.toFixed(6)}`
                        : "Enter your location manually or use auto-detect for precise coordinates"
                    }
                    slotProps={{
                      input: {
                        startAdornment: formData.coordinates.latitude && formData.coordinates.longitude && (
                          <LocationOnIcon color="primary" sx={{ mr: 1, alignSelf: 'flex-start', mt: 0.5 }} />
                        ),
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    startIcon={locationLoading ? <CircularProgress size={20} /> : <MyLocationIcon />}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    {locationLoading ? 'Detecting...' : 'Auto-detect'}
                  </Button>
                </Box>

                {locationError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {locationError}
                  </Alert>
                )}

                {formData.coordinates.latitude && formData.coordinates.longitude && (
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      icon={<LocationOnIcon />}
                      label="Location auto-detected successfully"
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                    {formData.addressComponents && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1, border: '1px solid', borderColor: 'success.main' }}>
                        <Typography variant="caption" color="success.dark" sx={{ fontWeight: 'bold' }}>
                          Administrative Hierarchy:
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {formData.addressComponents.state && (
                            <Typography variant="caption" display="block" color="success.dark">
                              <strong>State:</strong> {formData.addressComponents.state}
                            </Typography>
                          )}
                          {formData.addressComponents.district && (
                            <Typography variant="caption" display="block" color="success.dark">
                              <strong>District:</strong> {formData.addressComponents.district}
                            </Typography>
                          )}
                          {formData.addressComponents.block && (
                            <Typography variant="caption" display="block" color="success.dark">
                              <strong>Block/Area:</strong> {formData.addressComponents.block}
                            </Typography>
                          )}
                          {formData.addressComponents.city && (
                            <Typography variant="caption" display="block" color="success.dark">
                              <strong>City:</strong> {formData.addressComponents.city}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="property-type-label">Property Type</InputLabel>
                <Select
                  labelId="property-type-label"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  label="Property Type"
                >
                  <MenuItem value="">Select property type</MenuItem>
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                  <MenuItem value="Institutional">Institutional</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                </Select>
                <FormHelperText>Type of property</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Roof Area (m²)"
                name="roofArea"
                type="number"
                value={formData.roofArea}
                onChange={handleInputChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Total catchment area of your roof"
              />
            </Grid>
            
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="soil-type-label">Soil Type</InputLabel>
                <Select
                  labelId="soil-type-label"
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  label="Soil Type"
                >
                  <MenuItem value="">Select soil type</MenuItem>
                  <MenuItem value="Sandy">Sandy</MenuItem>
                  <MenuItem value="Loamy">Loamy</MenuItem>
                  <MenuItem value="Clay">Clay</MenuItem>
                  <MenuItem value="Silt">Silt</MenuItem>
                  <MenuItem value="Rocky">Rocky</MenuItem>
                </Select>
                <FormHelperText>Type of soil at your location</FormHelperText>
              </FormControl>
            </Grid> */}
            
            {/* <Grid item xs={12}>
              <TextField
                fullWidth
                label="Annual Rainfall (mm)"
                name="annualRainfall"
                type="number"
                value={formData.annualRainfall}
                onChange={handleInputChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Average annual rainfall in your area"
              />
            </Grid> */}
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Roof Image Upload
              </Typography>
              <Button
                variant="contained"
                component="label"
                sx={{ mb: 2 }}
              >
                Upload Rooftop Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  name="roofImage"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.roofImage && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={URL.createObjectURL(formData.roofImage)}
                    alt="Roof Preview"
                    sx={{ width: 100, height: 100, objectFit: 'cover', mr: 2 }}
                  />
                  <Typography variant="body2">
                    {formData.roofImage.name}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="system-type-label">System Type</InputLabel>
                <Select
                  labelId="system-type-label"
                  name="systemType"
                  value={formData.systemType}
                  onChange={handleInputChange}
                  label="System Type"
                >
                  <MenuItem value="">Select system type</MenuItem>
                  <MenuItem value="Storage">Storage System</MenuItem>
                  <MenuItem value="Recharge">Groundwater Recharge</MenuItem>
                  <MenuItem value="Hybrid">Hybrid System</MenuItem>
                </Select>
                <FormHelperText>Type of rainwater harvesting system</FormHelperText>
              </FormControl>
            </Grid>
            
            {(formData.systemType === 'Storage' || formData.systemType === 'Hybrid') && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Storage Capacity (L)"
                  name="storageCapacity"
                  type="number"
                  value={formData.storageCapacity}
                  onChange={handleInputChange}
                  required={formData.systemType === 'Storage' || formData.systemType === 'Hybrid'}
                  InputProps={{ inputProps: { min: 0 } }}
                  helperText="Total storage capacity in liters"
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="filtration-label">Filtration System</InputLabel>
                <Select
                  labelId="filtration-label"
                  name="filtrationSystem"
                  value={formData.filtrationSystem}
                  onChange={handleInputChange}
                  label="Filtration System"
                >
                  <MenuItem value="">Select filtration type</MenuItem>
                  <MenuItem value="Basic">Basic (Mesh Filter)</MenuItem>
                  <MenuItem value="Intermediate">Intermediate (Sand Filter)</MenuItem>
                  <MenuItem value="Advanced">Advanced (Multi-stage)</MenuItem>
                  <MenuItem value="None">None</MenuItem>
                </Select>
                <FormHelperText>Type of filtration system</FormHelperText>
              </FormControl>
            </Grid>
            
            {(formData.systemType === 'Recharge' || formData.systemType === 'Hybrid') && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recharge Pit Specifications
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Depth (m)"
                    name="rechargePit.depth"
                    type="number"
                    value={formData.rechargePit.depth}
                    onChange={handleNestedInputChange}
                    required={formData.systemType === 'Recharge' || formData.systemType === 'Hybrid'}
                    InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                    helperText="Depth of recharge pit"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Diameter (m)"
                    name="rechargePit.diameter"
                    type="number"
                    value={formData.rechargePit.diameter}
                    onChange={handleNestedInputChange}
                    required={formData.systemType === 'Recharge' || formData.systemType === 'Hybrid'}
                    InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                    helperText="Diameter of recharge pit"
                  />
                </Grid>
              </>
            )}
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="expertise-label">Your Expertise Level</InputLabel>
                <Select
                  labelId="expertise-label"
                  name="userContext.expertise"
                  value={formData.userContext.expertise}
                  onChange={handleInputChange}
                  label="Your Expertise Level"
                >
                  <MenuItem value="Beginner">Beginner - New to rainwater harvesting</MenuItem>
                  <MenuItem value="Intermediate">Intermediate - Some knowledge</MenuItem>
                  <MenuItem value="Expert">Expert - Advanced knowledge</MenuItem>
                </Select>
                <FormHelperText>This helps us tailor explanations to your level</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="interests-label">Areas of Interest</InputLabel>
                <Select
                  labelId="interests-label"
                  multiple
                  value={formData.userContext.interests}
                  onChange={handleInterestChange}
                  label="Areas of Interest"
                >
                  <MenuItem value="Cost savings">Cost savings</MenuItem>
                  <MenuItem value="Environmental impact">Environmental impact</MenuItem>
                  <MenuItem value="Technical details">Technical details</MenuItem>
                  <MenuItem value="Maintenance requirements">Maintenance requirements</MenuItem>
                  <MenuItem value="Regulatory compliance">Regulatory compliance</MenuItem>
                </Select>
                <FormHelperText>Select topics you're most interested in</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="language-label">Preferred Language</InputLabel>
                <Select
                  labelId="language-label"
                  name="userContext.preferredLanguage"
                  value={formData.userContext.preferredLanguage}
                  onChange={handleInputChange}
                  label="Preferred Language"
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                  <MenuItem value="Tamil">Tamil</MenuItem>
                  <MenuItem value="Marathi">Marathi</MenuItem>
                  <MenuItem value="Kannada">Kannada</MenuItem>
                </Select>
                <FormHelperText>Language for explanations (where available)</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Box component="img" src="/assets/assessment.jpg" alt="Rainwater Harvesting Assessment" sx={{ maxWidth: '100%', height: 'auto', maxHeight: 300 }} />
      </Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Rainwater Harvesting Assessment
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 1 ? (
              'Submit'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Assessment;