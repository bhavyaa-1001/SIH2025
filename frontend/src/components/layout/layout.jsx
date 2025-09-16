import React, { useContext } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './footer';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <Box className={`transition-colors duration-300 ${darkMode ? 'dark bg-darkNavy text-lightText' : 'bg-white text-gray-900'}`}>
      {user && <Sidebar onLogout={handleLogout} />}
      <Box sx={{ 
        ml: user ? { xs: 0, sm: 30 } : 0, 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;