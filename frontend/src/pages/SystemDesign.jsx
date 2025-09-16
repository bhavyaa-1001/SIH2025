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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import OptimizedImage from '../components/OptimizedImage';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WaterIcon from '@mui/icons-material/Water';

const SystemDesign = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    roofArea: '',
    annualRainfall: '',
    soilType: '',
    spaceAvailable: '',
    budget: '',
    waterNeeds: ''
  });
  
  const [designRecommendation, setDesignRecommendation] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setDesignRecommendation(null);
  };

  const generateDesign = () => {
    // In a real application, this would call an API to generate a design
    // For now, we'll simulate a design recommendation
    const recommendation = {
      systemType: 'Rooftop Rainwater Harvesting with Underground Storage',
      components: [
        {
          name: 'Collection System',
          description: 'Gutters and downspouts to collect rainwater from the roof',
          estimatedCost: '₹15,000 - ₹25,000',
          image: '/assets/gutters.jpg'
        },
        {
          name: 'First Flush Diverter',
          description: 'Diverts the first rainfall that contains most contaminants',
          estimatedCost: '₹5,000 - ₹8,000',
          image: '/assets/first-flush.jpg'
        },
        {
          name: 'Filtration System',
          description: 'Multi-stage filtration to remove debris and contaminants',
          estimatedCost: '₹20,000 - ₹35,000',
          image: '/assets/filtration.jpg'
        },
        {
          name: 'Storage Tank',
          description: 'Underground concrete tank with 10,000L capacity',
          estimatedCost: '₹45,000 - ₹60,000',
          image: '/assets/tank.jpg'
        },
        {
          name: 'Pump System',
          description: 'Submersible pump with pressure tank for distribution',
          estimatedCost: '₹12,000 - ₹18,000',
          image: '/assets/pump.jpg'
        },
        {
          name: 'Recharge Pit',
          description: 'Groundwater recharge pit with filter media',
          estimatedCost: '₹8,000 - ₹15,000',
          image: '/assets/recharge-pit.jpg'
        }
      ],
      totalEstimatedCost: '₹105,000 - ₹161,000',
      annualWaterSavings: '80,000 - 120,000 liters',
      paybackPeriod: '4-6 years',
      maintenanceRequirements: 'Quarterly filter cleaning, annual system inspection'
    };
    
    setDesignRecommendation(recommendation);
    handleNext();
  };

  const steps = [
    {
      label: 'Property Information',
      description: 'Enter details about your property',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Soil Type"
              name="soilType"
              select
              SelectProps={{
                native: true,
              }}
              value={formData.soilType}
              onChange={handleInputChange}
            >
              <option value=""></option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="clay">Clay</option>
              <option value="rocky">Rocky</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Available Space for System"
              name="spaceAvailable"
              type="number"
              value={formData.spaceAvailable}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">m²</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Requirements',
      description: 'Define your water needs and budget',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Water Needs"
              name="waterNeeds"
              select
              SelectProps={{
                native: true,
              }}
              value={formData.waterNeeds}
              onChange={handleInputChange}
            >
              <option value=""></option>
              <option value="gardening">Gardening Only</option>
              <option value="nonpotable">Non-Potable Household Use</option>
              <option value="potable">Potable Water</option>
              <option value="groundwater">Groundwater Recharge</option>
              <option value="comprehensive">Comprehensive System</option>
            </TextField>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'System Recommendation',
      description: 'Review your custom system design',
      content: designRecommendation ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Recommended System: {designRecommendation.systemType}
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            System Components:
          </Typography>
          
          <Grid container spacing={2}>
            {designRecommendation.components.map((component, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      height: 140,
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <WaterIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {component.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {component.description}
                    </Typography>
                    <Typography variant="body2">
                      Estimated Cost: {component.estimatedCost}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1" gutterBottom>
              System Summary:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Total Estimated Cost:</strong> {designRecommendation.totalEstimatedCost}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Annual Water Savings:</strong> {designRecommendation.annualWaterSavings}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Estimated Payback Period:</strong> {designRecommendation.paybackPeriod}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Maintenance:</strong> {designRecommendation.maintenanceRequirements}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              This is a preliminary design recommendation. For a detailed implementation plan, please consult with a rainwater harvesting specialist.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <ArchitectureIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7, mb: 2 }} />
          <Typography variant="body1">
            Click "Generate Design" to create your custom rainwater harvesting system design.
          </Typography>
        </Box>
      )
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EngineeringIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Rainwater Harvesting System Design
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Design a custom rainwater harvesting system tailored to your property and needs.
        </Typography>
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="subtitle1">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {step.description}
                </Typography>
                {step.content}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    {index === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleReset}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Start Over
                      </Button>
                    ) : index === steps.length - 2 ? (
                      <Button
                        variant="contained"
                        onClick={generateDesign}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Generate Design
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                    )}
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Container>
  );
};

export default SystemDesign;