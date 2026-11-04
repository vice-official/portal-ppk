import type { FC, ChangeEvent } from 'react';
import {
  Card,
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  InputAdornment,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import type { CitizenStatus } from '../../../entities/citizen/types';
import { formatNumber } from '../../../shared/lib/formatNumber';

interface RegistryFiltersProps {
  search: string;
  status: CitizenStatus | 'all';
  gender: 'male' | 'female' | 'all';
  filteredCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: CitizenStatus | 'all') => void;
  onGenderChange: (gender: 'male' | 'female' | 'all') => void;
  onReset: () => void;
}

export const RegistryFilters: FC<RegistryFiltersProps> = ({
  search,
  status,
  gender,
  filteredCount,
  totalCount,
  onSearchChange,
  onStatusChange,
  onGenderChange,
  onReset,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
      }}
    >
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Поиск по ФИО..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Социальный статус"
            value={status}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onStatusChange(e.target.value as CitizenStatus | 'all')
            }
          >
            <MenuItem value="all">Все статусы</MenuItem>
            <MenuItem value="active">Активен</MenuItem>
            <MenuItem value="beneficiary">Льготник</MenuItem>
            <MenuItem value="pensioner">Пенсионер</MenuItem>
            <MenuItem value="underReview">На проверке</MenuItem>
            <MenuItem value="archived">В архиве</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Пол"
            value={gender}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onGenderChange(e.target.value as 'male' | 'female' | 'all')
            }
          >
            <MenuItem value="all">Любой пол</MenuItem>
            <MenuItem value="male">Мужской</MenuItem>
            <MenuItem value="female">Женский</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 2.5 }}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<RotateLeftIcon />}
            onClick={onReset}
            sx={{ height: 40, borderRadius: 2 }}
          >
            Сбросить
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Найдено записей:{' '}
          <Box component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {formatNumber(filteredCount)}
          </Box>{' '}
          из {formatNumber(totalCount)}
        </Typography>
      </Box>
    </Card>
  );
};
