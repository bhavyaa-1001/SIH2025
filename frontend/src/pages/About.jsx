import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  WaterDrop,
  Science,
  VerifiedUser,
  BarChart,
  Lightbulb
} from '@mui/icons-material';

const About = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Our Rainwater Harvesting Assessment System
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Empowering sustainable water management through advanced technology
        </Typography>
      </Box>

      {/* Mission Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              We are committed to addressing India's water scarcity challenges through innovative technology solutions. 
              Our rainwater harvesting assessment system aims to empower individuals, communities, and organizations 
              to implement effective water conservation strategies.
            </Typography>
            <Typography variant="body1">
              By combining advanced AI/ML algorithms with domain expertise, we provide accurate assessments, 
              ensure regulatory compliance, and deliver personalized guidance for sustainable water management.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image="/assets/images/mission.svg"
                alt="Rainwater harvesting mission"
                sx={{ objectFit: 'contain', p: 2 }}
              />
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Technology Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Our Technology
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Science color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  AI-Powered Assessment
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Our system uses machine learning algorithms to accurately calculate runoff coefficients, 
                infiltration rates, and recharge potential based on your specific property characteristics 
                and local environmental conditions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VerifiedUser color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  Compliance Verification
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Our system automatically checks your rainwater harvesting design against local regulations 
                and building codes across different regions in India, ensuring your implementation meets all 
                legal requirements and standards.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Lightbulb color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  Personalized Explanations
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Using advanced language models and retrieval-augmented generation (RAG), our system provides 
                tailored explanations based on your expertise level, interests, and preferred language, making 
                complex technical information accessible to everyone.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Benefits Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Benefits of Rainwater Harvesting
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WaterDrop color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Water Conservation" 
                  secondary="Reduce dependence on municipal water supply and lower your water bills"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <Eco color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Environmental Impact" 
                  secondary="Mitigate flooding, reduce soil erosion, and contribute to groundwater recharge"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <BarChart color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Economic Benefits" 
                  secondary="Save on water costs and potentially qualify for tax incentives or rebates"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image="/assets/images/benefits.svg"
                alt="Rainwater harvesting benefits"
                sx={{ objectFit: 'contain', p: 2 }}
              />
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Team Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Our Team
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Water Resource Engineers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our team includes experienced water resource engineers who specialize in 
                sustainable water management systems and hydrological modeling.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI/ML Specialists
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI experts develop and maintain the machine learning models that power 
                our assessment system, ensuring accurate calculations and predictions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Regulatory Experts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our compliance specialists stay updated with the latest regulations across 
                different regions to ensure our system provides accurate compliance information.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contact Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Get in Touch
        </Typography>
        <Typography variant="body1" paragraph>
          Have questions about our rainwater harvesting assessment system? 
          We're here to help you implement sustainable water management solutions.
        </Typography>
        <Typography variant="body1">
          Email: contact@rainwaterharvesting.org | Phone: +91 123-456-7890
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;