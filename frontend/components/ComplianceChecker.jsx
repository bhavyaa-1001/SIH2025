import React, { useState } from 'react';
import { assessmentApi } from '../src/api/index.js';
import { Card, CardContent, Typography, TextField, Button, Box, CircularProgress, Alert, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * ComplianceChecker component for checking rainwater harvesting system compliance
 * with local regulations based on user input parameters
 */
const ComplianceChecker = ({ projectData }) => {
  const [location, setLocation] = useState(projectData?.location || '');
  const [loading, setLoading] = useState(false);
  const [complianceReport, setComplianceReport] = useState(null);
  const [error, setError] = useState(null);

  // Extract project data if available
  const initialData = {
    roofArea: projectData?.roofArea || '',
    infiltrationRate: projectData?.infiltrationRate || '',
    rechargePotential: projectData?.rechargePotential || '',
    systemSpecs: projectData?.systemSpecs || {
      rechargePit: {
        depth: '',
        diameter: ''
      }
    }
  };

  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'location') {
      setLocation(value);
      return;
    }
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., systemSpecs.rechargePit.depth)
      const parts = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        
        current[parts[parts.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Convert string values to numbers where appropriate
      const processedData = {
        location,
        roofArea: parseFloat(formData.roofArea),
        infiltrationRate: parseFloat(formData.infiltrationRate),
        rechargePotential: parseFloat(formData.rechargePotential),
        systemSpecs: {
          rechargePit: {
            depth: parseFloat(formData.systemSpecs.rechargePit.depth),
            diameter: parseFloat(formData.systemSpecs.rechargePit.diameter)
          }
        }
      };
      
      // Call API to check compliance
      const response = await assessmentApi.checkCompliance(processedData);
      
      // Axios returns the data directly in the response.data property
      setComplianceReport(response.data);
    } catch (err) {
      console.error('Error checking compliance:', err);
      setError(err.message || 'Failed to check compliance');
    } finally {
      setLoading(false);
    }
  };

  const renderComplianceResults = () => {
    if (!complianceReport) return null;
    
    const { isCompliant, region, results, summary } = complianceReport;
    
    return (
      <Box sx={{ mt: 4 }}>
        <Alert 
          severity={isCompliant ? "success" : "warning"}
          icon={isCompliant ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
          sx={{ mb: 2 }}
        >
          {summary}
        </Alert>
        
        <Typography variant="h6" gutterBottom>
          Compliance Details for {region}
        </Typography>
        
        {results.map((result, index) => (
          <Accordion key={index} defaultExpanded={!result.compliant}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: result.compliant ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)'
              }}
            >
              <Typography>
                {result.compliant ? '✅' : '❌'} {result.ruleId}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" gutterBottom>
                <strong>Regulation:</strong> {result.text}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Source:</strong> {result.source}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                <strong>Status:</strong> {result.compliant ? 'Compliant' : 'Non-compliant'}
              </Typography>
              <Typography variant="body2">
                <strong>Details:</strong> {result.details}
              </Typography>
              
              {!result.compliant && result.recommendation && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <strong>Recommendation:</strong> {result.recommendation}
                </Alert>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Regulatory Compliance Check
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Check if your rainwater harvesting system design complies with local regulations.
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
            <TextField
              label="Location (City/State)"
              name="location"
              value={location}
              onChange={handleInputChange}
              required
              fullWidth
              helperText="Enter your city or state for location-specific regulations"
            />
            
            <TextField
              label="Roof Area (m²)"
              name="roofArea"
              type="number"
              value={formData.roofArea}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
            
            <TextField
              label="Infiltration Rate (mm/hr)"
              name="infiltrationRate"
              type="number"
              value={formData.infiltrationRate}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.1 }}
            />
            
            <TextField
              label="Recharge Potential (L)"
              name="rechargePotential"
              type="number"
              value={formData.rechargePotential}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
            
            <TextField
              label="Recharge Pit Depth (m)"
              name="systemSpecs.rechargePit.depth"
              type="number"
              value={formData.systemSpecs.rechargePit.depth}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.1 }}
            />
            
            <TextField
              label="Recharge Pit Diameter (m)"
              name="systemSpecs.rechargePit.diameter"
              type="number"
              value={formData.systemSpecs.rechargePit.diameter}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Box>
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Checking...' : 'Check Compliance'}
          </Button>
        </form>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {renderComplianceResults()}
      </CardContent>
    </Card>
  );
};

export default ComplianceChecker;