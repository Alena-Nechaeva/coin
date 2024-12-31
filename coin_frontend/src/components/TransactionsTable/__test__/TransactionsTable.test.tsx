import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionsTable from '../TransactionsTable';
import { useRouter } from 'next/navigation';
import React from 'react';
import userEvent from '@testing-library/user-event';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => '123'),
  useDispatch: jest.fn(),
  useStore: jest.fn(() => ({})),
}));

describe('TransactionsTable', () => {
  const mockRouterPush = jest.fn();
  const mockRows = [
    {
      id: 1,
      amount: 1000,
      date: '2024-12-11T18:06:27.185Z',
      from: '57182315040078587841651371',
      to: '74213041477477406320783754',
    },
    {
      id: 2,
      amount: 2000,
      date: '2024-12-11T18:06:38.250Z',
      from: '11366001775664578606435751',
      to: '74213041477477406320783754',
    },
  ];

  const renderComponent = () => render(<TransactionsTable rows={mockRows} text={'Test Transactions'} isPagination={false} />);

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    renderComponent();
  });

  it('renders the TransactionsTable with rows and title', () => {
    expect(screen.getByText('Test Transactions')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders the correct number of rows in the table', () => {
    const rows = screen.getAllByRole('row');
    expect(rows.length - 1).toBe(mockRows.length);
  });

  it('redirects to transactions history page on button click', async () => {
    const button = screen.getByRole('button', { name: /Check transactions history →/i });
    await userEvent.click(button);
    expect(mockRouterPush).toHaveBeenCalledWith('/accounts/123/history');
  });
});
