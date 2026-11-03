import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#38bdf8',
            light: '#7dd3fc',
            dark: '#0284c7',
            contrastText: '#0f172a',
        },
        secondary: {
            main: '#818cf8',
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
            light: '#34d399',
        },
        warning: {
            main: '#f59e0b',
        },
        error: {
            main: '#f43f5e',
        },
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h4: {
            fontWeight: 800,
            letterSpacing: '-0.03em',
        },
        h6: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 14,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#111726',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: 'none',
                },
            },
        },
    },
});