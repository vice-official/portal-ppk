import type { Meta, StoryObj } from '@storybook/react-vite';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import ElderlyOutlinedIcon from '@mui/icons-material/ElderlyOutlined';
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
          <Box sx={{ width: 280, p: 2, bgcolor: 'background.default' }}>
            <Story />
          </Box>
        </ThemeProvider>
    ),
  ],
  args: {
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const TotalCitizens: Story = {
  name: 'Всего граждан (Default)',
  args: {
    title: 'Всего граждан',
    value: 500,
    color: 'primary',
    icon: <PeopleAltOutlinedIcon />,
  },
};

export const Active: Story = {
  name: 'Активные граждане',
  args: {
    title: 'Активные',
    value: 342,
    color: 'success',
    icon: <CheckCircleOutlinedIcon />,
  },
};

export const Beneficiaries: Story = {
  name: 'Получатели льгот',
  args: {
    title: 'Льготники',
    value: 68,
    color: 'info',
    icon: <VolunteerActivismOutlinedIcon />,
  },
};

export const Pensioners: Story = {
  name: 'Пенсионеры',
  args: {
    title: 'Пенсионеры',
    value: 54,
    color: 'secondary',
    icon: <ElderlyOutlinedIcon />,
  },
};

export const PendingReview: Story = {
  name: 'На проверке',
  args: {
    title: 'На проверке',
    value: 24,
    color: 'warning',
    icon: <PendingActionsOutlinedIcon />,
  },
};

export const NonClickable: Story = {
  name: 'Без перехода (Readonly)',
  args: {
    title: 'Всего граждан',
    value: 500,
    color: 'primary',
    icon: <PeopleAltOutlinedIcon />,
    onClick: undefined,
  },
};