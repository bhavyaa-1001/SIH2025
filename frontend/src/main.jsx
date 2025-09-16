import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider as CustomThemeProvider, ThemeContext } from './context/ThemeContext'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useContext, useEffect } from 'react'
import { lightTheme, darkTheme } from './theme'
import { initPerformanceMonitoring } from './utils/performanceMonitor'

// Wrap the App component with MUI ThemeProvider based on the theme context
const ThemedApp = () => {
  const { darkMode } = useContext(ThemeContext);
  
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
  }, []);
  
  return (
    <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomThemeProvider>
      <ThemedApp />
    </CustomThemeProvider>
  </StrictMode>,
)
