import type { FC, ReactNode } from 'react';
import { Card, Box, Typography, Grid } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import ElderlyOutlinedIcon from '@mui/icons-material/ElderlyOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import { formatNumber } from '../../../shared/lib/formatNumber';
import type { KpiSummary } from '../model/types';
import type { CitizenStatus } from '../../../entities/citizen/types';

export interface KpiCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'secondary';
  delta?: number;
  onClick?: () => void;
}

const COLOR_MAP = {
  primary: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' },
  success: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  warning: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  info: { text: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)' },
  secondary: { text: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
};

export const KpiCard: FC<KpiCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  delta,
  onClick,
}) => {
  const themeAccent = COLOR_MAP[color] ?? COLOR_MAP.primary;

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3.5,
        bgcolor: '#111726',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick
          ? {
              borderColor: themeAccent.text,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px -4px ${themeAccent.bg}`,
              '& .arrow-icon': {
                opacity: 1,
                transform: 'translateX(3px)',
              },
            }
          : {},
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 2.5,
            bgcolor: themeAccent.bg,
            color: themeAccent.text,
            '& svg': { fontSize: 20 },
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        variant="h4"
        sx={{
          my: 1.5,
          fontWeight: 800,
          color: 'text.primary',
          letterSpacing: '-0.03em',
        }}
      >
        {formatNumber(value)}
      </Typography>

      {delta !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: delta >= 0 ? '#10b981' : '#f87171',
            }}
          >
            {delta > 0 ? '+' : ''}
            {delta.toFixed(1)}%
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            динамика за месяц
          </Typography>
        </Box>
      )}
    </Card>
  );
};

interface KpiGridProps {
  kpi: KpiSummary;
  onSelectStatus?: (status: CitizenStatus | 'all') => void;
}

export const KpiGrid: FC<KpiGridProps> = ({ kpi, onSelectStatus }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KpiCard
          title="Всего граждан"
          value={kpi.totalCitizens}
          icon={<PeopleAltOutlinedIcon />}
          color="primary"
          onClick={() => onSelectStatus?.('all')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KpiCard
          title="Активные"
          value={kpi.activeCount}
          icon={<CheckCircleOutlinedIcon />}
          color="success"
          onClick={() => onSelectStatus?.('active')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KpiCard
          title="Льготники"
          value={kpi.beneficiariesCount}
          icon={<VolunteerActivismOutlinedIcon />}
          color="info"
          onClick={() => onSelectStatus?.('beneficiary')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KpiCard
          title="Пенсионеры"
          value={kpi.pensionersCount}
          icon={<ElderlyOutlinedIcon />}
          color="secondary"
          onClick={() => onSelectStatus?.('pensioner')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
        <KpiCard
          title="На проверке"
          value={kpi.pendingReviewCount}
          icon={<PendingActionsOutlinedIcon />}
          color="warning"
          onClick={() => onSelectStatus?.('underReview')}
        />
      </Grid>
    </Grid>
  );
};
