import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { RegistryFilters } from './RegistryFilters';
import { theme } from '../../../app/theme';
import type { CitizenStatus } from '../../../entities/citizen/types';

const meta: Meta<typeof RegistryFilters> = {
    title: 'Registry/RegistryFilters',
    component: RegistryFilters,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme}>
                <Box sx={{ p: 3, bgcolor: 'background.default', maxWidth: 1200 }}>
                    <Story />
                </Box>
            </ThemeProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof RegistryFilters>;

export const Interactive: Story = {
    name: 'Интерактивный фильтр',
    render: () => {
        const [search, setSearch] = useState('');
        const [status, setStatus] = useState<CitizenStatus | 'all'>('all');
        const [gender, setGender] = useState<'male' | 'female' | 'all'>('all');

        return (
            <RegistryFilters
                search={search}
                status={status}
                gender={gender}
                filteredCount={500}
                totalCount={500}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onGenderChange={setGender}
                onReset={() => {
                    setSearch('');
                    setStatus('all');
                    setGender('all');
                }}
            />
        );
    },
};

export const WithActiveFilters: Story = {
    name: 'С активными фильтрами',
    args: {
        search: 'Иванов',
        status: 'beneficiary',
        gender: 'male',
        filteredCount: 14,
        totalCount: 500,
        onSearchChange: () => {},
        onStatusChange: () => {},
        onGenderChange: () => {},
        onReset: () => {},
    },
};

export const EmptyResults: Story = {
    name: 'Нет совпадений',
    args: {
        search: 'Несуществующий гражданин',
        status: 'all',
        gender: 'all',
        filteredCount: 0,
        totalCount: 500,
        onSearchChange: () => {},
        onStatusChange: () => {},
        onGenderChange: () => {},
        onReset: () => {},
    },
};