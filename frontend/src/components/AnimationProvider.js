import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';

// Create a theme instance with animation preferences
const theme = createTheme({
  palette: {
    primary: {
      main: '#0077b5', // LinkedIn blue
      dark: '#005e93',
      light: '#42a5f5',
    },
    secondary: {
      main: '#00a0dc', // LinkedIn light blue
    },
    background: {
      default: '#f5f7f9',
    },
  },
  typography: {
    fontFamily: [
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

// Global animation styles
const globalStyles = {
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  '@keyframes slideInUp': {
    '0%': { transform: 'translateY(20px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
  '@keyframes slideInDown': {
    '0%': { transform: 'translateY(-20px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
  '@keyframes slideInLeft': {
    '0%': { transform: 'translateX(-20px)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 },
  },
  '@keyframes slideInRight': {
    '0%': { transform: 'translateX(20px)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 },
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(0, 119, 181, 0.4)' },
    '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(0, 119, 181, 0)' },
    '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(0, 119, 181, 0)' },
  },
  '@keyframes floatUp': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-5px)' },
  },
  '.animate-fade-in': {
    animation: 'fadeIn 0.5s ease forwards',
  },
  '.animate-slide-up': {
    animation: 'slideInUp 0.5s ease forwards',
  },
  '.animate-slide-down': {
    animation: 'slideInDown 0.5s ease forwards',
  },
  '.animate-slide-left': {
    animation: 'slideInLeft 0.5s ease forwards',
  },
  '.animate-slide-right': {
    animation: 'slideInRight 0.5s ease forwards',
  },
  '.animate-pulse': {
    animation: 'pulse 2s infinite',
  },
  '.animate-float': {
    animation: 'floatUp 3s ease-in-out infinite',
  },
  '.stagger-fade > *': {
    opacity: 0,
    animation: 'fadeIn 0.5s ease forwards',
  },
  '.hover-lift': {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
  },
  '.hover-scale': {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
};

const AnimationProvider = ({ children }) => {
  // Function to generate stagger delays for child elements
  React.useEffect(() => {
    const staggerElements = document.querySelectorAll('.stagger-fade > *');
    staggerElements.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.1}s`;
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
};

export default AnimationProvider;
