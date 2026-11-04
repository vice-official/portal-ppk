import type { FC } from 'react';
import { Card, Box, Typography } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { formatNumber } from '../../../shared/lib/formatNumber';
import type { MonthlyDynamicsSlice } from '../model/types';

interface RegistrationDynamicsChartProps {
  data: MonthlyDynamicsSlice[];
}

export const RegistrationDynamicsChart: FC<RegistrationDynamicsChartProps> = ({ data = [] }) => {
  const hasRegistrations = data.some((d) => d.registrations > 0);

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3.5,
        bgcolor: '#111726',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Динамика регистрации за 12 месяцев
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Фактическое распределение притока граждан по месяцам
          </Typography>
        </Box>
        {!hasRegistrations && (
          <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 600 }}>
            Период пуст
          </Typography>
        )}
      </Box>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              allowDecimals={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              formatter={(value: unknown) => [formatNumber(Number(value) || 0), 'Регистраций']}
              labelFormatter={(label, payload) => {
                const year = payload?.[0]?.payload?.year;
                return year ? `${label} ${year}` : label;
              }}
              contentStyle={{
                backgroundColor: '#161f30',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                color: '#f8fafc',
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="registrations"
              stroke="#38bdf8"
              strokeWidth={2.5}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};
