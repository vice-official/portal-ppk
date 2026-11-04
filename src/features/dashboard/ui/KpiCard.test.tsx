import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { ThemeProvider } from '@mui/material/styles';
import { KpiCard } from './KpiCard';
import { theme } from '../../../app/theme';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('KpiCard', () => {
  it('рендерит заголовок и форматированное число', () => {
    renderWithTheme(
      <KpiCard
        title="Всего на учёте"
        value={100000}
        icon={<PeopleAltOutlinedIcon data-testid="kpi-icon" />}
      />,
    );

    expect(screen.getByText('Всего на учёте')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-icon')).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('отображает положительную дельту со знаком плюс', () => {
    renderWithTheme(
      <KpiCard title="Новые за месяц" value={340} delta={12.4} icon={<PeopleAltOutlinedIcon />} />,
    );

    expect(screen.getByText('+12.4%')).toBeInTheDocument();
    expect(screen.getByText('динамика за месяц')).toBeInTheDocument();
  });

  it('отображает отрицательные', () => {
    renderWithTheme(
      <KpiCard title="Требуют проверки" value={45} delta={-5.2} icon={<PeopleAltOutlinedIcon />} />,
    );

    expect(screen.getByText('-5.2%')).toBeInTheDocument();
  });
});
