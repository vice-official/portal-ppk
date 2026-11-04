import type { FC } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
    onToggleMobileDrawer: () => void;
}

export const Header: FC<HeaderProps> = ({ onToggleMobileDrawer }) => {
    return (
        <AppBar
            component="header"
            position="fixed"
            sx={{
                bgcolor: 'rgba(9, 13, 22, 0.95)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'none',
                display: { md: 'none' },
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        color="inherit"
                        aria-label="Открыть главное меню"
                        edge="start"
                        onClick={onToggleMobileDrawer}
                        sx={{ mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        PORTAL-PPK
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};