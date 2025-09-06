import React, { useContext } from 'react';
import Navbar from './Navbar';
import Footer from './footer';
import { ThemeContext } from '../../context/ThemeContext';

const Layout = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;