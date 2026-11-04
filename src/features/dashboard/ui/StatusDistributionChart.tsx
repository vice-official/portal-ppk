import type { FC } from 'react';
import { useMemo } from 'react';
import { Card, Box, Typography } from '@mui/material';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatNumber } from '../../../shared/lib/formatNumber';
import type { StatusDistribution } from '../model/types';
import type { CitizenStatus } from '../../../entities/citizen/types';

interface StatusDistributionChartProps {
  data?: StatusDistribution[];
  onSelectStatus?: (status: CitizenStatus) => void;
}

interface TooltipItemProps {
  payload?: StatusDistribution;
}

const STATUS_COLOR_MAP: Record<CitizenStatus, string> = {
  active: '#38bdf8',
  beneficiary: '#10b981',
  pensioner: '#ec4899',
  underReview: '#f59e0b',
  archived: '#64748b',
};

export const StatusDistributionChart: FC<StatusDistributionChartProps> = ({
  data = [],
  onSelectStatus,
}) => {
  const totalCount = useMemo(() => data.reduce((acc, curr) => acc + curr.count, 0), [data]);

  const chartData = useMemo(() => {
    if (totalCount === 0) {
      return [
        {
          label: 'Нет данных',
          count: 1,
          percentage: 0,
          status: 'archived' as CitizenStatus,
          fill: '#334155',
        },
      ];
    }
    return data.map((item) => ({
      ...item,
      fill: STATUS_COLOR_MAP[item.status] ?? '#64748b',
    }));
  }, [data, totalCount]);

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
        Распределение по статусам
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
        Кликните на сектор для фильтрации в реестре
      </Typography>

      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="45%"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={totalCount > 0 ? 4 : 0}
              stroke="none"
              style={{ cursor: onSelectStatus && totalCount > 0 ? 'pointer' : 'default' }}
              onClick={(entry) => {
                const status = (entry.payload as StatusDistribution | undefined)?.status;
                if (totalCount > 0 && onSelectStatus && status) {
                  onSelectStatus(status);
                }
              }}
            />
            {totalCount > 0 && (
              <Tooltip
                formatter={(value: unknown, _name: unknown, props: TooltipItemProps) => [
                  `${formatNumber(Number(value) || 0)} (${props.payload?.percentage ?? 0}%)`,
                  'Граждан',
                ]}
                contentStyle={{
                  backgroundColor: '#161f30',
                  borderRadius: 10,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#f8fafc',
                  fontSize: 13,
                }}
              />
            )}
            <Legend
              align="center"
              iconType="circle"
              wrapperStyle={{ paddingTop: 8 }}
              formatter={(value: string) => {
                const current = data.find((d) => d.label === value);
                return (
                  <span
                    style={{
                      color: '#94a3b8',
                      fontSize: 12,
                      marginRight: 8,
                      cursor: onSelectStatus && current ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (onSelectStatus && current) {
                        onSelectStatus(current.status);
                      }
                    }}
                  >
                    {value}{' '}
                    <strong style={{ color: '#f8fafc' }}>
                      {current ? `${current.percentage}%` : ''}
                    </strong>
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};
