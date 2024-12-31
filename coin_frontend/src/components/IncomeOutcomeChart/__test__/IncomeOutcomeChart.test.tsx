import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IncomeOutcomeChart from '../IncomeOutcomeChart';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';

jest.mock('@/utils/utils', () => ({
  getNiceBalance: jest.fn(value => `${value}`),
}));

describe('IncomeOutcomeChart', () => {
  const theme = createTheme();
  const mockChartData = [
    { month: 'January', income: 5000, outcome: 3000 },
    { month: 'February', income: 7000, outcome: 4000 },
    { month: 'March', income: 6000, outcome: 3500 },
  ];
  const mockGetNiceBalance = jest.requireMock('@/utils/utils').getNiceBalance;

  const renderComponent = (chartData = mockChartData) =>
    render(
      <ThemeProvider theme={theme}>
        <IncomeOutcomeChart chartData={chartData} />
      </ThemeProvider>,
    );

  it('renders the title correctly', () => {
    renderComponent();
    const title = screen.getByText('Incoming and outgoing transactions');
    expect(title).toBeInTheDocument();
  });

  it('renders the chart with the correct number of bars', () => {
    renderComponent();
    mockChartData.forEach(({ month }) => {
      const visibleText = screen.getAllByText(month).filter(element => element.getAttribute('aria-hidden') !== 'true');
      expect(visibleText.length).toBe(1);
      expect(visibleText[0]).toBeInTheDocument();
    });
  });

  it('uses the getNiceBalance function for formatting y-axis values', () => {
    renderComponent();
    expect(mockGetNiceBalance).toHaveBeenCalledWith(0);
    expect(mockGetNiceBalance).toHaveBeenCalledWith(10000);
    expect(mockGetNiceBalance).toHaveBeenCalledWith(20000);
  });

  it('renders nothing if chartData is empty', () => {
    renderComponent([]);
    expect(screen.queryByRole('graphics-symbol')).not.toBeInTheDocument();
    expect(screen.queryByText('Incoming and outgoing transactions')).toBeInTheDocument();
  });
});
