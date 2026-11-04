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
  Card,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { useDashboardStats } from '../../features/dashboard/api/useDashboardStats';
import { KpiGrid } from '../../features/dashboard/ui/KpiCard';
import { RegistrationDynamicsChart } from '../../features/dashboard/ui/RegistrationDynamicsChart';
import { StatusDistributionChart } from '../../features/dashboard/ui/StatusDistributionChart';
import { AgeDistributionChart } from '../../features/dashboard/ui/AgeDistributionChart';
import { RecentCitizensWidget } from '../../features/dashboard/ui/RecentCitizenWidget';
import type { CitizenStatus } from '../../entities/citizen/types';

interface DashboardPageProps {
  onNavigateToRegistry?: () => void;
  onFilterByStatus?: (status: CitizenStatus | 'all') => void;
  onSelectCitizen?: (id: string) => void;
}

export const DashboardPage: FC<DashboardPageProps> = ({
  onNavigateToRegistry,
  onFilterByStatus,
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
          {error instanceof Error ? error.message : 'Не удалось загрузить аналитику'}
        </Alert>
      </Container>
    );
  }

  const isEmpty = !isLoading && (!data || data.kpi.totalCitizens === 0);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Аналитика и статистика
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Оперативные показатели базы учёта граждан в реальном времени
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
          Обновить
        </Button>
      </Stack>

      {isLoading ? (
        <DashboardSkeleton />
      ) : isEmpty ? (
        <Card
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3.5,
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            bgcolor: '#111726',
          }}
        >
          <PeopleAltOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Данные отсутствуют
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}
          >
            В базе пока нет записей о гражданах. Добавьте записи через картотеку, чтобы здесь
            сформировались отчёты и графики.
          </Typography>
          {onNavigateToRegistry && (
            <Button variant="contained" onClick={onNavigateToRegistry}>
              Перейти в картотеку
            </Button>
          )}
        </Card>
      ) : data ? (
        <Grid container spacing={2.5}>
          <Grid size={12}>
            <KpiGrid kpi={data.kpi} onSelectStatus={onFilterByStatus} />
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <RegistrationDynamicsChart data={data.monthlyDynamics} />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <StatusDistributionChart
              data={data.statusDistribution}
              onSelectStatus={(status) => onFilterByStatus?.(status)}
            />
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
  <Grid container spacing={2.5}>
    <Grid size={12}>
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5].map((key) => (
          <Grid key={key} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Skeleton
              variant="rounded"
              height={130}
              sx={{ borderRadius: 3.5, bgcolor: '#111726' }}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>

    <Grid size={{ xs: 12, lg: 8 }}>
      <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3.5, bgcolor: '#111726' }} />
    </Grid>

    <Grid size={{ xs: 12, lg: 4 }}>
      <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3.5, bgcolor: '#111726' }} />
    </Grid>

    <Grid size={{ xs: 12, lg: 6 }}>
      <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3.5, bgcolor: '#111726' }} />
    </Grid>

    <Grid size={{ xs: 12, lg: 6 }}>
      <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3.5, bgcolor: '#111726' }} />
    </Grid>
  </Grid>
);
