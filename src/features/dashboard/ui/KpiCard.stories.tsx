import type { Meta, StoryObj } from '@storybook/react';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { KpiCard } from './KpiCard';
import { theme } from '../../../app/theme';

const meta: Meta<typeof KpiCard> = {
        title: 'Dashboard/KpiCard',
        component: KpiCard,
        decorators: [
            (Story) => (
                <ThemeProvider theme={theme}>
                <Box sx={{ width: 320, p: 2, bgcolor: 'background.default' }}>
    <Story />
    </Box>
    </ThemeProvider>
),
],
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
    args: {
        title: 'Всего на учёте',
        value: 124580,
        delta: 8.4,
        color: 'primary',
        icon: <PeopleAltOutlinedIcon />,
    },
};

export const NegativeDelta: Story = {
    args: {
        title: 'Требуют проверки',
        value: 1420,
        delta: -3.1,
        color: 'warning',
        icon: <PendingActionsOutlinedIcon />,
    },
};

export const WithoutDelta: Story = {
    args: {
        title: 'Получатели льгот',
        value: 38200,
        color: 'success',
        icon: <VolunteerActivismOutlinedIcon />,
    },
};