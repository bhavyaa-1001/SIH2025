/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4dabf5',
          DEFAULT: '#2196f3',
          dark: '#1769aa',
        },
        secondary: {
          light: '#33ab9f',
          DEFAULT: '#009688',
          dark: '#00695f',
        },
        darkNavy: '#0a192f', // Navy blue for dark mode
        lightText: '#ffffff', // White text for dark mode
        accentPurple: '#8a85ff', // Accent color for attractiveness
        accentTeal: '#64ffda', // Another accent color
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}