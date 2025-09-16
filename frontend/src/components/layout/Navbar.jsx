import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
// MUI icons removed
// ThemeToggle removed
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  // Function to format username - remove 29C if present
  const formatUsername = (user) => {
    if (!user) return '';
    
    // Get username from user object
    let username = user.name || user.username || user.email?.split('@')[0] || '';
    
    // Remove 29C from username if present
    return username.replace(/29C/g, '').trim();
  };
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component={Link} to="/" sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
              Rainwater Harvesting System
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Optimize your water conservation with smart solutions
            </Typography>
          </Box>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <Chip
                label={formatUsername(user)}
                color="primary"
                variant="outlined"
                size="medium"
                sx={{ ml: 1 }}
                avatar={<Box component="span" sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{formatUsername(user).charAt(0).toUpperCase()}</Box>}
              />
            </>
          )}
          
          {user ? (
            <Button 
              color="inherit" 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              sx={{ ml: 2 }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;