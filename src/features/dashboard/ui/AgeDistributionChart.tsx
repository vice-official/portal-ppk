import type { FC } from 'react';
import { Card, Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatNumber } from '../../../shared/lib/formatNumber';
import type { AgeGroups } from '../model/types';

interface AgeDistributionChartProps {
  data: AgeGroups[];
}

export const AgeDistributionChart: FC<AgeDistributionChartProps> = ({ data = [] }) => {
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
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Возрастная структура
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
        Распределение по демографическим группам
      </Typography>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis
              dataKey="groups"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
              formatter={(value: unknown) => [formatNumber(Number(value) || 0), 'Граждан']}
              contentStyle={{
                backgroundColor: '#161f30',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                fontSize: 13,
              }}
            />
            <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} maxBarSize={42} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};
