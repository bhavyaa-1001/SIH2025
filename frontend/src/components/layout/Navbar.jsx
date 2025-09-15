import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Button,
  Container,
  Menu,
  MenuItem
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThemeToggle from '../ThemeToggle';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
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
        <WaterDropIcon sx={{ mr: 1 }} />
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
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          
          {user && (
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}
          
          <ThemeToggle />
          
          {user ? (
            <Button 
              color="inherit" 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              startIcon={<LogoutIcon />}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              startIcon={<LoginIcon />}
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