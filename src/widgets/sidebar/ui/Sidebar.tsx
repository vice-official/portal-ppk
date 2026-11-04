import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CloseIcon from '@mui/icons-material/Close';

export const DRAWER_WIDTH = 250;

interface SidebarProps {
    isMobile: boolean;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

const MENU_ITEMS = [
    { text: 'Дашборд', path: '/dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
    { text: 'Картотека', path: '/registry', icon: <PeopleAltOutlinedIcon fontSize="small" /> },
];

export const Sidebar: FC<SidebarProps> = ({ isMobile, mobileOpen, onCloseMobile }) => {
    const location = useLocation();

    const content = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2.5,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography sx={{ color: '#090d16', fontWeight: 900, fontSize: 16 }}>P</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                        PORTAL-PPK
                    </Typography>
                </Box>
                {isMobile && (
                    <IconButton onClick={onCloseMobile} aria-label="Закрыть меню" size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>

            <Box sx={{ px: 2, flexGrow: 1 }}>
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
                    Разделы
                </Typography>

                <List sx={{ pt: 0.5 }}>
                    {MENU_ITEMS.map((item) => {
                        const isSelected = location.pathname.startsWith(item.path);
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.75 }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    selected={isSelected}
                                    onClick={() => isMobile && onCloseMobile()}
                                    sx={{
                                        borderRadius: 2.5,
                                        py: 1,
                                        px: 1.5,
                                        '&.Mui-selected': {
                                            bgcolor: 'rgba(56, 189, 248, 0.08)',
                                            color: 'primary.main',
                                            border: '1px solid rgba(56, 189, 248, 0.2)',
                                        },
                                        '&.Mui-selected .MuiListItemIcon-root': {
                                            color: 'primary.main',
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
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }} aria-label="Главная навигация">
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={onCloseMobile}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            bgcolor: '#070a10',
                            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                        },
                    }}
                >
                    {content}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            bgcolor: '#070a10',
                            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                        },
                    }}
                    open
                >
                    {content}
                </Drawer>
            )}
        </Box>
    );
};