import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar
} from '@mui/material';
// MUI icons removed

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  
  const menuItems = [
    { text: 'Dashboard', icon: <span>📊</span>, path: '/' },
    { text: 'Assessment', icon: <span>🔍</span>, path: '/assessment' },
    { text: 'Compliance', icon: <span>✅</span>, path: '/compliance' },
    { text: 'Water Savings', icon: <span>💧</span>, path: '/water-savings' },
    { text: 'System Design', icon: <span>🏗️</span>, path: '/system-design' },
    { text: 'Maintenance', icon: <span>🔧</span>, path: '/maintenance' },
    { text: 'Reports', icon: <span>📈</span>, path: '/results' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" color="primary" sx={{ fontSize: 24 }}>💧</Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          RainSmart
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '0 20px 20px 0',
                mr: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ? 'white' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/settings"
            selected={location.pathname === '/settings'}
            sx={{
              borderRadius: '0 20px 20px 0',
              mr: 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <span>⚙️</span>
            </ListItemIcon>
            <ListItemText primary="Setting" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: '0 20px 20px 0',
              mr: 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <span>🚪</span>
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>U</Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            User Name
          </Typography>
          <Typography variant="caption" color="text.secondary">
            29°C
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;