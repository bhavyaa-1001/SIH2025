import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton 
        onClick={toggleTheme} 
        color="inherit" 
        className={`
          transition-all duration-300 ease-in-out 
          hover:scale-110 
          rounded-full p-2 
          ${darkMode ? 
            'bg-accentTeal text-darkNavy hover:bg-accentPurple hover:text-lightText' : 
            'bg-primary hover:bg-accentPurple hover:text-lightText'}
          shadow-lg hover:shadow-xl
        `}
      >
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;