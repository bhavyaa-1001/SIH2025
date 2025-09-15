import { createContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always use light theme
  const darkMode = false;

  // Remove dark mode class if it exists
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
  }
  
  // Reset to default light theme
  document.body.style.backgroundColor = '';
  document.body.style.color = '';
  
  // Remove any saved theme preference
  if (localStorage.getItem('darkMode')) {
    localStorage.removeItem('darkMode');
  }

  return (
    <ThemeContext.Provider value={{ darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};