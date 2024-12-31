import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import TransactionForm from '../TransactionForm';
import React from 'react';

describe('TransactionForm', () => {
  const useParams = jest.requireMock('next/navigation').useParams;

  const renderComponent = (balance: number) =>
    render(
      <Provider store={store}>
        <TransactionForm balance={balance} />
      </Provider>,
    );

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ account: '12345' });
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(['123456']));
    Storage.prototype.setItem = jest.fn();
  });

  it('renders the form', () => {
    renderComponent(1000);
    expect(screen.getByText('New transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Recipient`s account number')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('shows validation error if amount is more than balance', () => {
    renderComponent(100);
    const amountInput = screen.getByLabelText('Amount');
    fireEvent.change(amountInput, { target: { value: 200 } });
    fireEvent.blur(amountInput);

    waitFor(() => {
      expect(screen.getByText('The amount entered exceeds the available balance')).toBeInTheDocument();
    });
  });

  it('saves recipient account to localStorage after successful transaction', () => {
    const mockTransferFunds = jest.fn(() => ({
      payload: { success: true },
    }));

    renderComponent(1000);
    const recipientInput = screen.getByLabelText('Recipient`s account number');
    const amountInput = screen.getByLabelText('Amount');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(recipientInput, { target: { value: '987654' } });
    fireEvent.change(amountInput, { target: { value: '50' } });
    fireEvent.click(sendButton);

    waitFor(() => {
      expect(mockTransferFunds).toHaveBeenCalledWith({
        from: '123456',
        to: '987654',
        amount: 50,
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('destinations', JSON.stringify(['123456', '987654']));
    });
  });

  it('loads account suggestions from localStorage', () => {
    renderComponent(1000);
    const recipientInput = screen.getByLabelText('Recipient`s account number');
    fireEvent.focus(recipientInput);
    fireEvent.keyDown(recipientInput, { key: 'ArrowDown' });

    expect(screen.getByText('123456')).toBeInTheDocument();
  });
});
