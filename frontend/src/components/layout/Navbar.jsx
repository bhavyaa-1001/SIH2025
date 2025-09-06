import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar>
          <WaterDropIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            RainSmart
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/assessment">
              Assessment
            </Button>
            <Button color="inherit" component={Link} to="/compliance">
              Compliance
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;