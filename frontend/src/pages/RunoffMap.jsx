import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import RunoffMap from '../components/RunoffMap';

const RunoffMapPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Runoff Coefficient Map
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          Click anywhere on the map to calculate the runoff coefficient for that location.
          The runoff coefficient indicates how much rainfall becomes runoff in that area.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <RunoffMap />
        </Box>
      </Paper>
    </Container>
  );
};

export default RunoffMapPage;