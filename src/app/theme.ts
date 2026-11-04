import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38bdf8',
      light: '#7dd3fc',
      dark: '#0284c7',
      contrastText: '#090d16',
    },
    background: {
      default: '#090d16',
      paper: '#111726',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    success: {
      main: '#10b981',
      contrastText: '#090d16',
    },
    warning: {
      main: '#f59e0b',
      contrastText: '#090d16',
    },
    error: {
      main: '#f43f5e',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.015em' },
    h3: { fontSize: '1.125rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowX: 'hidden',
          backgroundColor: '#090d16',
        },
        '*:focus-visible': {
          outline: '2px solid #38bdf8 !important',
          outlineOffset: '2px !important',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 16px',
          transition: 'all 0.15s ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111726',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
});
