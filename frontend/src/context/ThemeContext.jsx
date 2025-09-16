import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply theme effect when component mounts or darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      // Remove dark mode class if it exists
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
      }
      
      // Reset to default light theme
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }, [darkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};