import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const Results = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await axios.get(`/api/assessments/${id}`);
        setAssessment(response.data);
        
        // Fetch personalized explanation
        const explanationResponse = await axios.get(`/api/explanations/personalize`, {
          params: { assessmentId: id }
        });
        setExplanation(explanationResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while fetching the assessment');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessment();
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleDownloadReport = () => {
    window.open(`/api/assessments/${id}/report`, '_blank');
  };
  
  const handleCheckCompliance = () => {
    window.location.href = `/compliance?assessmentId=${id}`;
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading assessment results...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!assessment) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="warning">Assessment not found</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Box component="img" src="/assets/images/results.svg" alt="Assessment Results" sx={{ maxWidth: '100%', height: 'auto', maxHeight: 300 }} />
      </Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Assessment Results
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Summary" />
            <Tab label="Technical Details" />
            <Tab label="Personalized Explanation" />
          </Tabs>
        </Box>
        
        {tabValue === 0 && (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Property Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Location</Typography>
                    <Typography variant="body1" gutterBottom>{assessment.location}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Property Type</Typography>
                    <Typography variant="body1" gutterBottom>{assessment.propertyType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Roof Area</Typography>
                    <Typography variant="body1" gutterBottom>{assessment.roofArea} m²</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Soil Type</Typography>
                    <Typography variant="body1" gutterBottom>{assessment.soilType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Annual Rainfall</Typography>
                    <Typography variant="body1" gutterBottom>{assessment.annualRainfall} mm</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">System Type</Typography>
                    <Typography variant="body1" gutterBottom>{assessment.systemType}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Potential Water Savings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Annual Harvesting Potential</Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {assessment.results?.annualHarvestingPotential?.toLocaleString()} L
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Monthly Average</Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {assessment.results?.monthlyAverage?.toLocaleString()} L
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Water Savings</Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      ₹{assessment.results?.costSavings?.toLocaleString()}/year
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Environmental Impact
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Carbon Footprint Reduction</Typography>
                    <Typography variant="body1" gutterBottom>
                      {assessment.results?.environmentalImpact?.carbonReduction} kg CO₂/year
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Groundwater Contribution</Typography>
                    <Typography variant="body1" gutterBottom>
                      {assessment.results?.environmentalImpact?.groundwaterContribution} L/year
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  System Specifications
                </Typography>
                <Grid container spacing={2}>
                  {assessment.systemType !== 'Recharge' && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Storage Capacity</Typography>
                      <Typography variant="body1" gutterBottom>
                        {assessment.storageCapacity} L
                      </Typography>
                    </Grid>
                  )}
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Filtration System</Typography>
                    <Typography variant="body1" gutterBottom>
                      {assessment.filtrationSystem}
                    </Typography>
                  </Grid>
                  
                  {assessment.systemType !== 'Storage' && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Recharge Pit Specifications
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Depth</Typography>
                        <Typography variant="body1" gutterBottom>
                          {assessment.rechargePit?.depth} m
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Diameter</Typography>
                        <Typography variant="body1" gutterBottom>
                          {assessment.rechargePit?.diameter} m
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Technical Calculations
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Runoff Coefficient</Typography>
                    <Typography variant="body1" gutterBottom>
                      {assessment.results?.technicalDetails?.runoffCoefficient}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Infiltration Rate</Typography>
                    <Typography variant="body1" gutterBottom>
                      {assessment.results?.technicalDetails?.infiltrationRate} mm/hr
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Recharge Potential</Typography>
                    <Typography variant="body1" gutterBottom>
                      {assessment.results?.technicalDetails?.rechargePotential}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Calculation Formula
                </Typography>
                <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                  Annual Harvesting Potential = Roof Area × Annual Rainfall × Runoff Coefficient
                </Typography>
                
                <Typography variant="body2" component="div">
                  <strong>Your calculation:</strong><br />
                  {assessment.roofArea} m² × {assessment.annualRainfall} mm × {assessment.results?.technicalDetails?.runoffCoefficient} = {assessment.results?.annualHarvestingPotential?.toLocaleString()} L
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
        
        {tabValue === 2 && (
          <Box>
            {explanation ? (
              <Card>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Personalized For</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      <Chip label={`Expertise: ${assessment.userContext?.expertise || 'Beginner'}`} />
                      {assessment.userContext?.interests?.map((interest, index) => (
                        <Chip key={index} label={interest} variant="outlined" />
                      ))}
                      <Chip label={`Language: ${assessment.userContext?.preferredLanguage || 'English'}`} variant="outlined" />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h5" gutterBottom>
                    Your Personalized Explanation
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <ReactMarkdown>
                      {explanation.content}
                    </ReactMarkdown>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Alert severity="info">
                Personalized explanation is not available for this assessment.
              </Alert>
            )}
          </Box>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleDownloadReport}
          >
            Download Full Report
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckCompliance}
          >
            Check Compliance
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Results;