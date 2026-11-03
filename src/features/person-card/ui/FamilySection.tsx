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
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [newFullName, setNewFullName] = useState<string>('');
    const [newKinship, setNewKinship] = useState<FamilyMember['degreeOfKinship']>('супруг(а)');
    const [newBirthDate, setNewBirthDate] = useState<string>('');
    const [newIsLivingTogether, setNewIsLivingTogether] = useState<boolean>(true);

    const handleOpenDialog = () => {
        setNewFullName('');
        setNewKinship('супруг(а)');
        setNewBirthDate('');
        setNewIsLivingTogether(true);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleAddMember = () => {
        if (!newFullName.trim()) return;

        const newMember: FamilyMember = {
            id: uuidv4(),
            fullName: newFullName.trim(),
            degreeOfKinship: newKinship,
            dateOfBirth: newBirthDate || '2000-01-01',
            isLivingTogether: newIsLivingTogether,
        };

        onChange([...family, newMember]);
        handleCloseDialog();
    };

    const handleDeleteMember = (id: string) => {
        onChange(family.filter((m) => m.id !== id));
    };

    return (
        <Card
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Состав семьи и связи
                </Typography>
                <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    sx={{ borderRadius: 2 }}
                >
                    Добавить родственника
                </Button>
            </Box>

            {family.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    Информация о родственниках не заполнена
                </Typography>
            ) : (
                <TableContainer>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Степень родства</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>ФИО родственника</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Дата рождения</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Проживание</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Удалить</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {family.map((member) => (
                                <TableRow key={member.id}>
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
                                        <IconButton size="small" color="error" onClick={() => handleDeleteMember(member.id)}>
                                            <DeleteOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
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
                    <Button onClick={handleCloseDialog} color="inherit">
                        Отмена
                    </Button>
                    <Button onClick={handleAddMember} variant="contained" disabled={!newFullName.trim()}>
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};