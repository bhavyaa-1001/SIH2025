import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import { assessmentService } from '../services/api';

const steps = ['Property Details', 'System Specifications', 'User Preferences'];

const Assessment = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    // Property Details
    location: '',
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
        }
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  label="Location"
                >
                  <MenuItem value="">Select a location</MenuItem>
                  <MenuItem value="Delhi">Delhi</MenuItem>
                  <MenuItem value="Mumbai">Mumbai</MenuItem>
                  <MenuItem value="Bangalore">Bangalore</MenuItem>
                  <MenuItem value="Chennai">Chennai</MenuItem>
                  <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                  <MenuItem value="Pune">Pune</MenuItem>
                </Select>
                <FormHelperText>Select your property location</FormHelperText>
              </FormControl>
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
            
            <Grid item xs={12} sm={6}>
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
            </Grid>
            
            <Grid item xs={12}>
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
            </Grid>
            
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