import { render, screen, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import fetchMock from 'jest-fetch-mock';
import UserCurrency from '../UserCurrency';
import React from 'react';
import { useGetUserCurrenciesQuery } from '@/api/api';

jest.mock('@/utils/utils', () => ({
  formatCurrencyNumbers: jest.fn(value => `${value}`),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

describe('UserCurrency', () => {
  beforeAll(() => {
    fetchMock.mockOnceIf('http://localhost:8080/currencies', () =>
      Promise.resolve({
        status: 200,
        body: JSON.stringify({
          payload: [
            { amount: 123, code: 'USD' },
            { amount: 345, code: 'EUR' },
          ],
          error: '',
        }),
      }),
    );
  });

  it('renders hook useGetUserCurrenciesQuery', async () => {
    const { result } = renderHook(() => useGetUserCurrenciesQuery(), {
      wrapper: Wrapper,
    });

    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getUserCurrencies',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(result.current).toMatchObject({
      status: 'fulfilled',
      endpointName: 'getUserCurrencies',
      data: {},
      isLoading: false,
      isSuccess: true,
      isError: false,
      currentData: {},
      isFetching: false,
    });
  });

  it('renders the correct number of list items and a list container', () => {
    render(
      <Wrapper>
        <UserCurrency />
      </Wrapper>,
    );

    expect(screen.getByText('Your currencies')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('USD');
    expect(listItems[0]).toHaveTextContent('123');
    expect(listItems[1]).toHaveTextContent('EUR');
    expect(listItems[1]).toHaveTextContent('345');
  });
});
