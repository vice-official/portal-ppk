import type { FC, ChangeEvent } from 'react';
import { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { v4 as uuidv4 } from 'uuid';
import type { FamilyMember } from '../../../entities/citizen/types';

interface FamilySectionProps {
  family: FamilyMember[];
  onChange: (updatedFamily: FamilyMember[]) => void;
}

const KINSHIP_OPTIONS: FamilyMember['degreeOfKinship'][] = [
  'супруг(а)',
  'ребенок',
  'родитель',
  'иждивенец',
];

export const FamilySection: FC<FamilySectionProps> = ({ family, onChange }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [deleteCandidate, setDeleteCandidate] = useState<FamilyMember | null>(null);

  const [newFullName, setNewFullName] = useState<string>('');
  const [newKinship, setNewKinship] = useState<FamilyMember['degreeOfKinship']>('супруг(а)');
  const [newBirthDate, setNewBirthDate] = useState<string>('');
  const [newIsLivingTogether, setNewIsLivingTogether] = useState<boolean>(true);

  const handleOpenAddDialog = () => {
    setNewFullName('');
    setNewKinship('супруг(а)');
    setNewBirthDate('');
    setNewIsLivingTogether(true);
    setIsAddDialogOpen(true);
  };

  const handleConfirmAddMember = () => {
    if (!newFullName.trim()) return;

    const newMember: FamilyMember = {
      id: uuidv4(),
      fullName: newFullName.trim(),
      degreeOfKinship: newKinship,
      dateOfBirth: newBirthDate || '2000-01-01',
      isLivingTogether: newIsLivingTogether,
    };

    onChange([...family, newMember]);
    setIsAddDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    onChange(family.filter((m) => m.id !== deleteCandidate.id));
    setDeleteCandidate(null);
  };

  return (
    <Card
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
          Состав семьи и связи
        </Typography>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          aria-label="Добавить члена семьи"
        >
          Добавить
        </Button>
      </Box>

      {family.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          Информация о родственниках не заполнена
        </Typography>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" aria-label="Таблица состава семьи">
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Степень родства</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>ФИО родственника</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Дата рождения</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Проживание</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {family.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                    {member.degreeOfKinship}
                  </TableCell>
                  <TableCell>{member.fullName}</TableCell>
                  <TableCell>{member.dateOfBirth}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={member.isLivingTogether ? 'Совместно' : 'Раздельно'}
                      color={member.isLivingTogether ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ borderRadius: 1.5 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Удалить родственника ${member.fullName}`}
                      onClick={() => setDeleteCandidate(member)}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Новый член семьи</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="ФИО"
            value={newFullName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFullName(e.target.value)}
          />
          <TextField
            select
            fullWidth
            size="small"
            label="Степень родства"
            value={newKinship}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewKinship(e.target.value as FamilyMember['degreeOfKinship'])
            }
          >
            {KINSHIP_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ textTransform: 'capitalize' }}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Дата рождения"
            slotProps={{ inputLabel: { shrink: true } }}
            value={newBirthDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewBirthDate(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newIsLivingTogether}
                onChange={(e) => setNewIsLivingTogether(e.target.checked)}
              />
            }
            label="Совместное проживание"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsAddDialogOpen(false)} color="inherit">
            Отмена
          </Button>
          <Button
            onClick={handleConfirmAddMember}
            variant="contained"
            disabled={!newFullName.trim()}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog
        open={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-desc"
      >
        <DialogTitle id="confirm-delete-title" sx={{ fontWeight: 700 }}>
          Удалить запись о родственнике?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-desc">
            Вы собираетесь удалить из состава семьи «{deleteCandidate?.fullName}». Это действие
            нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteCandidate(null)} color="inherit">
            Отмена
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
