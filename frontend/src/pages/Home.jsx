import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WaterIcon from '@mui/icons-material/Water';
import AnimatedCard from '../components/AnimatedCard';
import { ThemeContext } from '../context/ThemeContext';
import { cssAnimations } from '../utils/animations';

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="relative"
      >
        {/* Animated background elements */}
        <Box className="absolute inset-0 overflow-hidden z-0">
          <Box 
            className={`${cssAnimations.bounceSlow} absolute`} 
            sx={{ 
              width: '300px', 
              height: '300px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)', 
              top: '-100px', 
              right: '-100px' 
            }}
          />
          <Box 
            className={`${cssAnimations.bounceSlow} absolute`} 
            sx={{ 
              width: '200px', 
              height: '200px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)', 
              bottom: '-50px', 
              left: '10%',
              animationDelay: '1s'
            }}
          />
        </Box>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom className={cssAnimations.fadeIn}>
                Smart Rainwater Harvesting Solutions
              </Typography>
              <Typography variant="h5" paragraph className={cssAnimations.slideIn} style={{ animationDelay: '200ms' }}>
                Optimize your rainwater harvesting system with AI-powered assessment and personalized recommendations.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }} className={cssAnimations.fadeIn} style={{ animationDelay: '400ms' }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  component={RouterLink}
                  to="/assessment"
                  className="transition-transform hover:scale-105"
                >
                  Start Assessment
                </Button>
                <Button 
                  variant="outlined" 
                  className="transition-transform hover:scale-105"
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
        <Typography variant="h3" component="h2" align="center" gutterBottom className={cssAnimations.fadeIn}>
          Key Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <AnimatedCard
              title="Smart Assessment"
              description="Our AI analyzes your property details and local rainfall data to provide accurate harvesting potential."
              buttonText="Learn More"
              onClick={() => {}}
              delay={100}
              image="/assets/assessment.jpg"
            />
          </Grid>
          
          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <AnimatedCard
              title="Compliance Checker"
              description="Verify if your rainwater harvesting system meets local regulations and standards."
              buttonText="Check Compliance"
              onClick={() => {}}
              delay={200}
              image="/assets/compliance.jpg"
            />
          </Grid>
          
          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <AnimatedCard
              title="Water Savings Calculator"
              description="Estimate water savings and potential environmental impact of your harvesting system."
              buttonText="Calculate Savings"
              onClick={() => {}}
              delay={300}
              image="/assets/savings.jpg"
            />
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