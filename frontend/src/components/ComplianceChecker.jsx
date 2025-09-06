import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

const ComplianceChecker = () => {
  const [formData, setFormData] = useState({
    location: '',
    roofArea: '',
    infiltrationRate: '',
    rechargePotential: '',
    systemSpecs: {
      rechargePit: {
        depth: '',
        diameter: ''
      },
      filtrationSystem: false
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
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
  
  const handleFilterChange = (e) => {
    const { checked } = e.target;
    
    setFormData({
      ...formData,
      systemSpecs: {
        ...formData.systemSpecs,
        filtrationSystem: checked
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Convert string values to numbers
      const payload = {
        ...formData,
        roofArea: Number(formData.roofArea),
        infiltrationRate: Number(formData.infiltrationRate),
        rechargePotential: Number(formData.rechargePotential),
        systemSpecs: {
          ...formData.systemSpecs,
          rechargePit: {
            depth: Number(formData.systemSpecs.rechargePit.depth),
            diameter: Number(formData.systemSpecs.rechargePit.diameter)
          }
        }
      };
      
      const response = await axios.post('/api/compliance/check', payload);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while checking compliance');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Rainwater Harvesting Compliance Checker
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Check if your rainwater harvesting system design complies with local regulations
        </Typography>
        
        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                System Details
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                        <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                        <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                        <MenuItem value="Karnataka">Karnataka</MenuItem>
                      </Select>
                      <FormHelperText>Select your location for region-specific regulations</FormHelperText>
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
                    <TextField
                      fullWidth
                      label="Infiltration Rate (mm/hr)"
                      name="infiltrationRate"
                      type="number"
                      value={formData.infiltrationRate}
                      onChange={handleInputChange}
                      required
                      InputProps={{ inputProps: { min: 0 } }}
                      helperText="Soil infiltration rate at your location"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Recharge Potential (L/year)"
                      name="rechargePotential"
                      type="number"
                      value={formData.rechargePotential}
                      onChange={handleInputChange}
                      required
                      InputProps={{ inputProps: { min: 0 } }}
                      helperText="Estimated annual recharge potential"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Recharge Pit Specifications
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Depth (m)"
                      name="systemSpecs.rechargePit.depth"
                      type="number"
                      value={formData.systemSpecs.rechargePit.depth}
                      onChange={handleNestedInputChange}
                      required
                      InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                      helperText="Depth of recharge pit"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Diameter (m)"
                      name="systemSpecs.rechargePit.diameter"
                      type="number"
                      value={formData.systemSpecs.rechargePit.diameter}
                      onChange={handleNestedInputChange}
                      required
                      InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                      helperText="Diameter of recharge pit"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="filtration-label">Filtration System</InputLabel>
                      <Select
                        labelId="filtration-label"
                        name="systemSpecs.filtrationSystem"
                        value={formData.systemSpecs.filtrationSystem ? 'yes' : 'no'}
                        onChange={(e) => handleFilterChange({
                          target: { checked: e.target.value === 'yes' }
                        })}
                        label="Filtration System"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                      <FormHelperText>Does your system include a filtration component?</FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Check Compliance'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          
          {/* Results Section */}
          <Grid item xs={12} md={6}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
            
            {results ? (
              <Box>
                <Card elevation={3} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Compliance Summary
                    </Typography>
                    
                    <Alert 
                      severity={results.isCompliant ? "success" : "warning"}
                      icon={results.isCompliant ? <CheckCircleIcon /> : <CancelIcon />}
                      sx={{ mb: 2 }}
                    >
                      <AlertTitle>
                        {results.isCompliant ? "Compliant" : "Non-Compliant"}
                      </AlertTitle>
                      {results.summary}
                    </Alert>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Region: {results.region}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>
                      Detailed Results
                    </Typography>
                    
                    <List>
                      {results.results.map((result, index) => (
                        <Accordion key={index} sx={{ mb: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <ListItemIcon>
                              {result.compliant ? 
                                <CheckCircleIcon color="success" /> : 
                                <CancelIcon color="error" />}
                            </ListItemIcon>
                            <Typography>{result.ruleId}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body1" paragraph>
                              <strong>Regulation:</strong> {result.text}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" paragraph>
                              <strong>Source:</strong> {result.source}
                            </Typography>
                            <Typography variant="body2" paragraph>
                              <strong>Details:</strong> {result.details}
                            </Typography>
                            {!result.compliant && result.recommendation && (
                              <Alert severity="info" icon={<InfoIcon />}>
                                <AlertTitle>Recommendation</AlertTitle>
                                {result.recommendation}
                              </Alert>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </List>
                  </CardContent>
                </Card>
                
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Detailed Report
                  </Typography>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}>
                    <ReactMarkdown>
                      {results.detailedReport}
                    </ReactMarkdown>
                  </Box>
                </Paper>
              </Box>
            ) : (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: '400px'
                }}
              >
                <InfoIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" align="center" gutterBottom>
                  Enter your system details and click "Check Compliance"
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary">
                  We'll analyze your rainwater harvesting system against applicable regulations
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ComplianceChecker;