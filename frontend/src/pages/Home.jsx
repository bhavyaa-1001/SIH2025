import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WaterIcon from '@mui/icons-material/Water';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Smart Rainwater Harvesting Solutions
              </Typography>
              <Typography variant="h5" paragraph>
                Optimize your rainwater harvesting system with AI-powered assessment and personalized recommendations.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  component={RouterLink}
                  to="/assessment"
                >
                  Start Assessment
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  size="large"
                  component={RouterLink}
                  to="/about"
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="/hero-image.svg" 
                alt="Rainwater harvesting illustration"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                  display: { xs: 'none', md: 'block' }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Comprehensive Rainwater Assessment
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Our AI-powered system provides detailed analysis and personalized recommendations
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                <AssessmentIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Smart Assessment
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Get a comprehensive analysis of your property's rainwater harvesting potential using advanced AI algorithms.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                <CheckCircleIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Compliance Verification
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Ensure your system meets all local regulations and standards with our automated compliance checker.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                <WaterIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Personalized Explanations
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Receive easy-to-understand explanations tailored to your expertise level and specific interests.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Ready to optimize your rainwater harvesting system?
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Start your assessment today and get personalized recommendations for your property.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={RouterLink}
              to="/assessment"
            >
              Start Assessment
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;