import type { FC, SyntheticEvent, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    Card,
    Grid,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Alert,
    Snackbar,
    Stack,
    Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { citizenApi } from '../../shared/api/citizenApi';
import { FamilySection } from '../../features/person-card/ui/FamilySection';
import type { Citizen, CitizenStatus } from '../../entities/citizen/types';

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

export const CitizenDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState<number>(0);
    const [formState, setFormState] = useState<Citizen | null>(null);
    const [isAddressesSame, setIsAddressesSame] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

    const { data: citizen, isLoading, isError } = useQuery({
        queryKey: ['citizen', id],
        queryFn: () => (id ? citizenApi.getCitizenById(id) : Promise.resolve(null)),
        enabled: Boolean(id),
    });

    useEffect(() => {
        if (citizen) {
            setFormState(citizen);
            setIsAddressesSame(citizen.registrationAddress === citizen.residentialAddress);
        }
    }, [citizen]);

    const updateMutation = useMutation({
        mutationFn: (updated: Citizen) => citizenApi.updateCitizen(updated.id, updated),
        onSuccess: (updated) => {
            queryClient.setQueryData(['citizen', updated.id], updated);
            void queryClient.invalidateQueries({ queryKey: ['citizens'] });
            void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            setSnackbarOpen(true);
        },
    });

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !formState) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">Гражданин не найден</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/registry')} sx={{ mt: 2 }}>
                    В реестр
                </Button>
            </Container>
        );
    }

    const handleFieldChange = (field: keyof Citizen, value: unknown) => {
        setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleSameAddressToggle = (checked: boolean) => {
        setIsAddressesSame(checked);
        if (checked && formState) {
            setFormState({
                ...formState,
                residentialAddress: formState.registrationAddress,
            });
        }
    };

    const currentStatus = STATUS_CONFIG[formState.status] ?? STATUS_CONFIG.active;
    const fullName = `${formState.surname} ${formState.name} ${formState.patronymic}`.trim();

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Button
                        size="small"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/registry')}
                        sx={{ mb: 1, textTransform: 'none' }}
                    >
                        Назад к списку
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            {fullName}
                        </Typography>
                        <Chip
                            label={currentStatus.label}
                            color={currentStatus.color}
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                        />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        ID: {formState.id}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => updateMutation.mutate(formState)}
                    disabled={updateMutation.isPending}
                    sx={{ borderRadius: 2.5, px: 3 }}
                >
                    Сохранить изменения
                </Button>
            </Stack>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(_: SyntheticEvent, v: number) => setActiveTab(v)}>
                    <Tab label="Основные сведения" sx={{ fontWeight: 600, textTransform: 'none' }} />
                    <Tab label="Документы и адреса" sx={{ fontWeight: 600, textTransform: 'none' }} />
                    <Tab label="Семья и связи" sx={{ fontWeight: 600, textTransform: 'none' }} />
                    <Tab label="Образование" sx={{ fontWeight: 600, textTransform: 'none' }} />
                </Tabs>
            </Box>

            {/* Таб 1: Основные сведения */}
            {activeTab === 0 && (
                <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Фамилия"
                                value={formState.surname}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('surname', e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Имя"
                                value={formState.name}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('name', e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Отчество"
                                value={formState.patronymic}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('patronymic', e.target.value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="Дата рождения"
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={formState.dateOfBirth}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('dateOfBirth', e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Пол"
                                value={formState.sex}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('sex', e.target.value)
                                }
                            >
                                <MenuItem value="male">Мужской</MenuItem>
                                <MenuItem value="female">Женский</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Социальный статус"
                                value={formState.status}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('status', e.target.value)
                                }
                            >
                                <MenuItem value="active">Активен</MenuItem>
                                <MenuItem value="beneficiary">Льготник</MenuItem>
                                <MenuItem value="pensioner">Пенсионер</MenuItem>
                                <MenuItem value="underReview">На проверке</MenuItem>
                                <MenuItem value="archived">В архиве</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="СНИЛС"
                                value={formState.snils}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('snils', e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="ИНН"
                                value={formState.inn}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('inn', e.target.value)
                                }
                            />
                        </Grid>
                    </Grid>
                </Card>
            )}

            {/* Таб 2: Документы и адреса */}
            {activeTab === 1 && (
                <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Паспортные данные
                    </Typography>
                    <Grid container spacing={2.5} sx={{ mb: 4 }}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Серия"
                                value={formState.passportSeries}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('passportSeries', e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Номер"
                                value={formState.passportNumber}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('passportNumber', e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="Дата выдачи"
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={formState.dateOfIssued}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('dateOfIssued', e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Кем выдан"
                                value={formState.whoIssuedPassport}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('whoIssuedPassport', e.target.value)
                                }
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Контакты и адреса
                    </Typography>
                    <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Телефон"
                                value={formState.phoneNumber}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('phoneNumber', e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Email"
                                value={formState.email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('email', e.target.value)
                                }
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Адрес регистрации"
                                value={formState.registrationAddress}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const val = e.target.value;
                                    handleFieldChange('registrationAddress', val);
                                    if (isAddressesSame) {
                                        handleFieldChange('residentialAddress', val);
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isAddressesSame}
                                        onChange={(e) => handleSameAddressToggle(e.target.checked)}
                                    />
                                }
                                label="Фактический адрес совпадает с адресом регистрации"
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Фактический адрес проживания"
                                value={formState.residentialAddress}
                                disabled={isAddressesSame}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleFieldChange('residentialAddress', e.target.value)
                                }
                            />
                        </Grid>
                    </Grid>
                </Card>
            )}

            {/* Таб 3: Семья и связи */}
            {activeTab === 2 && (
                <FamilySection
                    family={formState.family}
                    onChange={(newFamily) => handleFieldChange('family', newFamily)}
                />
            )}

            {/* Таб 4: Образование */}
            {activeTab === 3 && (
                <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Записи об образовании
                    </Typography>
                    {formState.education.map((edu, idx) => (
                        <Box key={edu.id} sx={{ mb: idx !== formState.education.length - 1 ? 3 : 0 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth size="small" label="Учебное заведение" value={edu.institution} disabled />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth size="small" label="Квалификация / Степень" value={edu.degree} disabled />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField fullWidth size="small" label="Специальность" value={edu.specialization} disabled />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField fullWidth size="small" label="Год окончания" value={edu.endOfStudy} disabled />
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </Card>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message="Данные гражданина успешно сохранены"
            />
        </Container>
    );
};