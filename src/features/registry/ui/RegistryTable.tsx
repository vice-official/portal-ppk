import type { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import type { Citizen, CitizenStatus } from '../../../entities/citizen/types';

interface RegistryTableProps {
  citizens: Citizen[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalFilteredCount: number;
  sortBy?: 'name' | 'surname' | 'dateOfBirth' | 'createdAt';
  sortOrder?: 'ascending' | 'descending';
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onSortChange: (field: 'surname' | 'dateOfBirth') => void;
  onSelectCitizen: (id: string) => void;
}

const STATUS_CONFIG: Record<
  CitizenStatus,
  { label: string; color: 'success' | 'primary' | 'info' | 'warning' | 'default' }
> = {
  active: { label: 'Активен', color: 'primary' },
  beneficiary: { label: 'Льготник', color: 'success' },
  pensioner: { label: 'Пенсионер', color: 'info' },
  underReview: { label: 'На проверке', color: 'warning' },
  archived: { label: 'В архиве', color: 'default' },
};

function calculateAge(dateString: string): number {
  const birth = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const RegistryTable: FC<RegistryTableProps> = ({
  citizens,
  isLoading,
  page,
  pageSize,
  totalFilteredCount,
  sortBy,
  sortOrder,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onSelectCitizen,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden',
        boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.04)',
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>
                <TableSortLabel
                  active={sortBy === 'surname'}
                  direction={sortOrder === 'ascending' ? 'asc' : 'desc'}
                  onClick={() => onSortChange('surname')}
                >
                  Гражданин (ФИО)
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>СНИЛС</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <TableSortLabel
                  active={sortBy === 'dateOfBirth'}
                  direction={sortOrder === 'ascending' ? 'asc' : 'desc'}
                  onClick={() => onSortChange('dateOfBirth')}
                >
                  Дата рождения (Возраст)
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Регион</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Действия
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton variant="text" width={180} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" width={80} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={90} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="circular" width={32} height={32} sx={{ ml: 'auto' }} />
                  </TableCell>
                </TableRow>
              ))
            ) : citizens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    Записи не найдены по заданным критериям
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              citizens.map((citizen) => {
                const status = STATUS_CONFIG[citizen.status] ?? STATUS_CONFIG.active;
                const age = calculateAge(citizen.dateOfBirth);
                const fullName = `${citizen.surname} ${citizen.name} ${citizen.patronymic}`.trim();

                return (
                  <TableRow
                    key={citizen.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                    onClick={() => onSelectCitizen(citizen.id)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: 'primary.light',
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {citizen.surname[0]}
                          {citizen.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {citizen.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{citizen.snils}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{citizen.dateOfBirth}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {age} лет
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={status.label}
                        color={status.color}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem', borderRadius: 1.5 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{citizen.region}</Typography>
                    </TableCell>

                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Открыть профиль">
                        <IconButton size="small" onClick={() => onSelectCitizen(citizen.id)}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalFilteredCount}
        rowsPerPage={pageSize}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}`
        }
      />
    </Paper>
  );
};
