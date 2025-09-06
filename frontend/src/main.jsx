import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useContext } from 'react'
import { ThemeContext } from './context/ThemeContext'
import { lightTheme, darkTheme } from './theme'

const Root = () => {
  const { darkMode } = useContext(ThemeContext);
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
      <Root />
    </CustomThemeProvider>
  </StrictMode>,
)
