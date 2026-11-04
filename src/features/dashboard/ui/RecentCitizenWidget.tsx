import type { FC } from 'react';
import {
  Card,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Citizen, CitizenStatus } from '../../../entities/citizen/types';

interface RecentCitizensWidgetProps {
  citizens: Citizen[];
  onViewAll?: () => void;
  onSelectCitizen?: (id: string) => void;
}

const STATUS_CONFIG: Record<
  CitizenStatus,
  { label: string; text: string; bg: string; border: string }
> = {
  active: {
    label: 'Активен',
    text: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.25)',
  },
  beneficiary: {
    label: 'Льготник',
    text: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.25)',
  },
  pensioner: {
    label: 'Пенсионер',
    text: '#818cf8',
    bg: 'rgba(129, 140, 248, 0.1)',
    border: 'rgba(129, 140, 248, 0.25)',
  },
  underReview: {
    label: 'Проверка',
    text: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.25)',
  },
  archived: {
    label: 'Архив',
    text: '#64748b',
    bg: 'rgba(100, 116, 139, 0.1)',
    border: 'rgba(100, 116, 139, 0.25)',
  },
};

export const RecentCitizensWidget: FC<RecentCitizensWidgetProps> = ({
  citizens,
  onViewAll,
  onSelectCitizen,
}) => {
  const recentItems = citizens.slice(0, 5);

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3.5,
        bgcolor: '#111726',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Недавние регистрации
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Последние 5 добавленных карточек
          </Typography>
        </Box>
        {onViewAll && (
          <Button
            size="small"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            onClick={onViewAll}
            sx={{ color: 'primary.main', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Все записи
          </Button>
        )}
      </Box>

      <List disablePadding sx={{ flexGrow: 1 }}>
        {recentItems.map((item, index) => {
          const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.active;
          const isLast = index === recentItems.length - 1;
          const fullName = `${item.surname} ${item.name} ${item.patronymic}`.trim();

          return (
            <Box key={item.id}>
              <ListItem
                disableGutters
                sx={{
                  py: 1.5,
                  cursor: onSelectCitizen ? 'pointer' : 'default',
                  borderRadius: 2,
                  px: 1,
                  transition: 'background-color 0.15s ease',
                  '&:hover': onSelectCitizen ? { bgcolor: 'rgba(255, 255, 255, 0.03)' } : {},
                }}
                onClick={() => onSelectCitizen?.(item.id)}
              >
                <ListItemAvatar sx={{ minWidth: 46 }}>
                  <Avatar
                    sx={{
                      bgcolor: '#1a2235',
                      color: '#94a3b8',
                      width: 36,
                      height: 36,
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <PersonOutlinedIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                </ListItemAvatar>

                <Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'text.primary' }}
                    noWrap
                  >
                    {fullName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }} noWrap>
                    СНИЛС: {item.snils}
                  </Typography>
                </Box>

                <Chip
                  size="small"
                  label={status.label}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    borderRadius: 1.5,
                    bgcolor: status.bg,
                    color: status.text,
                    border: `1px solid ${status.border}`,
                    height: 24,
                  }}
                />
              </ListItem>
              {!isLast && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />}
            </Box>
          );
        })}
      </List>
    </Card>
  );
};
