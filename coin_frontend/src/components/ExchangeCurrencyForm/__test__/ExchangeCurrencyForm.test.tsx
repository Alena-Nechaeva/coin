import { render, screen, waitFor, fireEvent, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import fetchMock from 'jest-fetch-mock';
import ExchangeCurrencyForm from '../ExchangeCurrencyForm';
import React from 'react';
import { useGetAllCurrenciesQuery } from '@/api/api';

function Wrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

describe('ExchangeCurrencyForm', () => {
  beforeAll(() => {
    fetchMock.mockOnceIf('http://localhost:8080/all-currencies', () =>
      Promise.resolve({
        status: 200,
        body: JSON.stringify({
          payload: ['USD', 'EUR', 'JPY'],
          error: '',
        }),
      }),
    );
  });

  it('renders hook useGetAllCurrenciesQuery', async () => {
    const { result } = renderHook(() => useGetAllCurrenciesQuery(), {
      wrapper: Wrapper,
    });

    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getAllCurrencies',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(result.current).toMatchObject({
      status: 'fulfilled',
      endpointName: 'getAllCurrencies',
      data: {},
      isLoading: false,
      isSuccess: true,
      isError: false,
      currentData: {},
      isFetching: false,
    });
  });

  it('renders the form', async () => {
    render(
      <Wrapper>
        <ExchangeCurrencyForm />
      </Wrapper>,
    );

    // Check the title is rendered
    expect(screen.getByText('Currency exchange')).toBeInTheDocument();

    // Check the options to be in the list
    const fromCurrencyInput = screen.getByLabelText('From currency');
    fireEvent.focus(fromCurrencyInput);
    fireEvent.keyDown(fromCurrencyInput, { key: 'ArrowDown' });

    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
      expect(screen.getByText('EUR')).toBeInTheDocument();
      expect(screen.getByText('JPY')).toBeInTheDocument();
    });
  });
});
