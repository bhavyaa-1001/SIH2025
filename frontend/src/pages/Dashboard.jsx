import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { assessmentService } from '../services/api';
import Container from '@mui/material/Container';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
} from '@mui/material';
// MUI icons removed

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await assessmentService.getAssessments();
        setAssessments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError('Failed to load assessments');
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Filter assessments by status
  const completedAssessments = assessments.filter(assessment => assessment.status === 'completed');
  const pendingAssessments = assessments.filter(assessment => assessment.status === 'pending');
  const queuedAssessments = assessments.filter(assessment => assessment.status === 'queued');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Drop2Source! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your rainwater harvesting system management platform
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Access Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ fontSize: '3rem', mb: 2 }}>💧</Box>
            <Typography variant="h6" gutterBottom>Water Savings</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Track your water conservation metrics
            </Typography>
            <Button 
              component={Link} 
              to="/water-savings" 
              variant="contained" 
              color="primary"
              sx={{ mt: 'auto' }}
            >
              View Details
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ fontSize: '3rem', mb: 2 }}>📋</Box>
            <Typography variant="h6" gutterBottom>Compliance</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Check regulatory compliance status
            </Typography>
            <Button 
              component={Link} 
              to="/compliance" 
              variant="contained" 
              color="primary"
              sx={{ mt: 'auto' }}
            >
              Check Now
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ fontSize: '3rem', mb: 2 }}>🔧</Box>
            <Typography variant="h6" gutterBottom>System Design</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View and modify your system design
            </Typography>
            <Button 
              component={Link} 
              to="/system-design" 
              variant="contained" 
              color="primary"
              sx={{ mt: 'auto' }}
            >
              View Design
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ fontSize: '3rem', mb: 2 }}>🔍</Box>
            <Typography variant="h6" gutterBottom>Assessment</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Start a new system assessment
            </Typography>
            <Button 
              component={Link} 
              to="/assessment" 
              variant="contained" 
              color="primary"
              sx={{ mt: 'auto' }}
            >
              Start Assessment
            </Button>
          </Paper>
        </Grid>

        {/* Quick Access Buttons */}
        {/* <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<span>📊</span>}
              component={Link}
              to="/assessment"
            >
              Start Assessment
            </Button>
            <Button
              variant="outlined"
              startIcon={<span>🧪</span>}
              component={Link}
              to="/compliance"
            >
              Check Compliance
            </Button>
          </Box>
        </Grid> */}
      </Grid>

    </Container>
  );
};

export default Dashboard;