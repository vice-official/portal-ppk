import type { FC, ReactNode } from 'react';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { AppRoutes } from './routes';

const DRAWER_WIDTH = 250;

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation();

    const menuItems = [
        { text: 'Дашборд', path: '/dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
        { text: 'Картотека', path: '/registry', icon: <PeopleAltOutlinedIcon fontSize="small" /> },
    ];

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
            <Drawer
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        bgcolor: '#070a10',
                        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2.5,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)',
                        }}
                    >
                        <Typography sx={{ color: '#090d16', fontWeight: 900, fontSize: 16 }}>P</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                        PORTAL-PPK
                    </Typography>
                </Box>

                <Box sx={{ px: 2 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            px: 1.5,
                            py: 1,
                            color: 'text.secondary',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            display: 'block',
                            fontSize: '0.7rem',
                        }}
                    >
                        Основное меню
                    </Typography>

                    <List sx={{ pt: 0.5 }}>
                        {menuItems.map((item) => {
                            const isSelected = location.pathname.startsWith(item.path);
                            return (
                                <ListItem key={item.text} disablePadding sx={{ mb: 0.75 }}>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        selected={isSelected}
                                        sx={{
                                            borderRadius: 2.5,
                                            py: 1,
                                            px: 1.5,
                                            transition: 'all 0.15s ease',
                                            '&.Mui-selected': {
                                                bgcolor: 'rgba(56, 189, 248, 0.08)',
                                                color: 'primary.main',
                                                border: '1px solid rgba(56, 189, 248, 0.2)',
                                            },
                                            '&.Mui-selected .MuiListItemIcon-root': {
                                                color: 'primary.main',
                                            },
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.04)',
                                            },
                                            color: 'text.secondary',
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit', minWidth: 34 }}>{item.icon}</ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography sx={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.875rem' }}>
                                                    {item.text}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${DRAWER_WIDTH}px)`,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <AppRoutes />
            </Layout>
        </BrowserRouter>
    );
}