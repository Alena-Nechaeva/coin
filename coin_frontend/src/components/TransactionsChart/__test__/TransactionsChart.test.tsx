import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionsChart from '../TransactionsChart';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => '123'),
}));

describe('TransactionsChart', () => {
  const mockRouterPush = jest.fn();
  const theme = createTheme();
  const mockChartData = [
    { month: 'January', amount: 5000 },
    { month: 'February', amount: 7000 },
    { month: 'March', amount: 6000 },
  ];

  const renderComponent = () =>
    render(
      <ThemeProvider theme={theme}>
        <TransactionsChart chartData={mockChartData} showHistoryBnt={true} />
      </ThemeProvider>,
    );

  beforeEach(() => {
    renderComponent();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it('renders the chart with correct title', () => {
    const title = screen.getByText('Balance dynamic');
    expect(title).toBeInTheDocument();
  });

  it('displays "Check balance history" button when showHistoryBnt is true', () => {
    const button = screen.getByText(/Check balance history/i);
    expect(button).toBeInTheDocument();
  });

  it('redirects to history page on button click', async () => {
    const button = screen.getByText(/Check balance history/i);
    await userEvent.click(button);
    expect(mockRouterPush).toHaveBeenCalledWith('/accounts/123/history');
  });

  it('renders the bar chart with correct label', () => {
    const januaryLabel = screen.getByText('January');
    const februaryLabel = screen.getByText('February');
    const marchLabel = screen.getByText('March');

    expect(januaryLabel).toBeInTheDocument();
    expect(februaryLabel).toBeInTheDocument();
    expect(marchLabel).toBeInTheDocument();
  });
});
