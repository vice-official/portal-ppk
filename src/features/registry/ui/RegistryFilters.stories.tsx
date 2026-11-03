import type { Meta, StoryObj } from '@storybook/react';
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
                <Box sx={{ p: 3, bgcolor: 'background.default', maxWidth: 1100 }}>
                    <Story />
                </Box>
            </ThemeProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof RegistryFilters>;

export const Interactive: Story = {
    render: () => {
        const [search, setSearch] = useState('');
        const [status, setStatus] = useState<CitizenStatus | 'all'>('all');
        const [gender, setGender] = useState<'male' | 'female' | 'all'>('all');

        return (
            <RegistryFilters
                search={search}
                status={status}
                gender={gender}
                filteredCount={482}
                totalCount={100000}
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