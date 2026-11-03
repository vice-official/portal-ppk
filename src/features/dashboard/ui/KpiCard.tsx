import type { FC, ReactNode } from 'react';
import { Card, Box, Typography, Grid } from '@mui/material';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import { formatNumber } from '../../../shared/lib/formatNumber';
import type { KpiSummary } from '../model/types';

export interface KpiCardProps {
    title: string;
    value: number;
    delta?: number;
    icon: ReactNode;
    color?: 'primary' | 'success' | 'warning' | 'info';
}

const COLOR_MAP = {
    primary: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' },
    success: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    warning: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    info: { text: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)' },
};

export const KpiCard: FC<KpiCardProps> = ({
                                              title,
                                              value,
                                              delta,
                                              icon,
                                              color = 'primary',
                                          }) => {
    const isPositive = (delta ?? 0) >= 0;
    const themeAccent = COLOR_MAP[color] ?? COLOR_MAP.primary;

    return (
        <Card
            elevation={0}
            sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3.5,
                bgcolor: '#111726',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
                '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.16)',
                    transform: 'translateY(-2px)',
                },
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
                        width: 38,
                        height: 38,
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
                    my: 2,
                    fontWeight: 800,
                    color: 'text.primary',
                    letterSpacing: '-0.03em',
                }}
            >
                {formatNumber(value)}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {delta !== undefined ? (
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1,
                            py: 0.25,
                            borderRadius: 2,
                            bgcolor: isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                            color: isPositive ? 'success.main' : 'error.main',
                            border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                        }}
                    >
                        {isPositive ? (
                            <ArrowDropUpRoundedIcon sx={{ ml: -0.5, fontSize: 18 }} />
                        ) : (
                            <ArrowDropDownRoundedIcon sx={{ ml: -0.5, fontSize: 18 }} />
                        )}
                        {isPositive ? `+${delta}%` : `${delta}%`}
                    </Box>
                ) : null}

                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {delta !== undefined ? 'динамика за месяц' : 'актуально на сегодня'}
                </Typography>
            </Box>
        </Card>
    );
};

interface KpiGridProps {
    kpi: KpiSummary;
}

export const KpiGrid: FC<KpiGridProps> = ({ kpi }) => {
    return (
        <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                    title="Всего на учете"
                    value={kpi.totalCitizens}
                    delta={kpi.totalDeltaPercentage}
                    icon={<PeopleAltOutlinedIcon />}
                    color="primary"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                    title="Получатели льгот"
                    value={kpi.beneficiariesCount}
                    icon={<VolunteerActivismOutlinedIcon />}
                    color="success"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                    title="Новые за месяц"
                    value={kpi.newThisMonth}
                    icon={<PersonAddAlt1OutlinedIcon />}
                    color="info"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                    title="Требуют проверки"
                    value={kpi.pendingReviewCount}
                    icon={<PendingActionsOutlinedIcon />}
                    color="warning"
                />
            </Grid>
        </Grid>
    );
};