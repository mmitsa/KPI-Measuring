import { createTheme } from '@mui/material/styles';
import { arSA } from '@mui/material/locale';

export const createAppTheme = (direction: 'ltr' | 'rtl' = 'rtl') => {
  return createTheme(
    {
      direction,
      palette: {
        primary: {
          main: '#006C35', // Saudi Green
          light: '#2E8B57',
          dark: '#004D26',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#C5A572', // Saudi Gold
          light: '#D4BC96',
          dark: '#A68952',
          contrastText: '#000000',
        },
        error: {
          main: '#D32F2F',
          light: '#EF5350',
          dark: '#C62828',
        },
        warning: {
          main: '#F57C00',
          light: '#FF9800',
          dark: '#E65100',
        },
        success: {
          main: '#388E3C',
          light: '#4CAF50',
          dark: '#2E7D32',
        },
        info: {
          main: '#1976D2',
          light: '#2196F3',
          dark: '#1565C0',
        },
        background: {
          default: '#F5F5F5',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
        },
      },
      typography: {
        fontFamily: direction === 'rtl'
          ? "'Cairo', 'Roboto', sans-serif"
          : "'Roboto', 'Cairo', sans-serif",
        h1: {
          fontSize: '2.5rem',
          fontWeight: 700,
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 600,
        },
        h3: {
          fontSize: '1.75rem',
          fontWeight: 600,
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 600,
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 500,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 500,
        },
        body1: {
          fontSize: '1rem',
        },
        body2: {
          fontSize: '0.875rem',
        },
        button: {
          textTransform: 'none',
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
              borderRadius: 8,
              padding: '8px 24px',
            },
            contained: {
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 12,
            },
            elevation1: {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
          },
        },
      },
    },
    direction === 'rtl' ? arSA : {}
  );
};

export default createAppTheme;
