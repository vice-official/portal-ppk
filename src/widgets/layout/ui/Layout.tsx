import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import { Header } from '../../../widgets/header/ui/Header.tsx';
import { Sidebar, DRAWER_WIDTH } from '@/widgets/sidebar/ui/Sidebar';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh', width: '100%' }}>
            <CssBaseline />

            <Header onToggleMobileDrawer={() => setMobileOpen((prev) => !prev)} />

            <Sidebar
                isMobile={isMobile}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <Box
                component="main"
                id="main-content"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    mt: { xs: 7, md: 0 },
                    maxWidth: '100%',
                    overflowX: 'hidden',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};