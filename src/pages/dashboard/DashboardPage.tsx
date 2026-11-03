import type { FC } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Skeleton,
    Alert,
    Button,
    Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDashboardStats } from '../../features/dashboard/api/useDashboardStats';
import { KpiGrid } from '../../features/dashboard/ui/KpiCard';
import { RegistrationDynamicsChart } from '../../features/dashboard/ui/RegistrationDynamicsChart';
import { StatusDistributionChart } from '../../features/dashboard/ui/StatusDistributionChart';
import { AgeDistributionChart } from '../../features/dashboard/ui/AgeDistributionChart';
import { RecentCitizensWidget } from '../../features/dashboard/ui/RecentCitizenWidget';

interface DashboardPageProps {
    onNavigateToRegistry?: () => void;
    onSelectCitizen?: (id: string) => void;
}

export const DashboardPage: FC<DashboardPageProps> = ({
                                                          onNavigateToRegistry,
                                                          onSelectCitizen,
                                                      }) => {
    const { data, isLoading, isError, error, refetch } = useDashboardStats();

    if (isError) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={() => void refetch()}>
                            Повторить
                        </Button>
                    }
                >
                    {error instanceof Error ? error.message : 'Не удалось загрузить данные дашборда'}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Аналитика и статистика
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Оперативные показатели базы учета граждан
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<RefreshIcon />}
                    onClick={() => void refetch()}
                    disabled={isLoading}
                    sx={{ textTransform: 'none', borderRadius: 2.5 }}
                >
                    Обновить данные
                </Button>
            </Stack>

            {isLoading ? (
                <DashboardSkeleton />
            ) : data ? (
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <KpiGrid kpi={data.kpi} />
                    </Grid>

                    <Grid size={{ xs: 12, lg: 8 }}>
                        <RegistrationDynamicsChart data={data.monthlyDynamics} />
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <StatusDistributionChart data={data.statusDistribution} />
                    </Grid>

                    <Grid size={{ xs: 12, lg: 6 }}>
                        <AgeDistributionChart data={data.ageGroups} />
                    </Grid>

                    <Grid size={{ xs: 12, lg: 6 }}>
                        <RecentCitizensWidget
                            citizens={data.recentCitizens ?? []}
                            onViewAll={onNavigateToRegistry}
                            onSelectCitizen={onSelectCitizen}
                        />
                    </Grid>
                </Grid>
            ) : null}
        </Container>
    );
};

const DashboardSkeleton: FC = () => (
    <Grid container spacing={3}>
        <Grid size={12}>
            <Grid container spacing={3}>
                {[1, 2, 3, 4].map((key) => (
                    <Grid key={key} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Skeleton variant="rounded" height={160} sx={{ borderRadius: 4 }} />
                    </Grid>
                ))}
            </Grid>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
        </Grid>
    </Grid>
);