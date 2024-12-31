import { render, screen, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import RealTimeRateChanges from '../RealTimeRateChanges';
import React from 'react';
import { useGetCurrentCurrencyRateQuery } from '@/api/api';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import WS from 'jest-websocket-mock';

jest.mock('@/utils/utils', () => ({
  generateRandomString: jest.fn(() => `test-string`),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

describe('RealTimeRateChanges', () => {
  const theme = createTheme();

  it('renders hook useGetCurrentCurrencyRateQuery', async () => {
    const { result } = renderHook(() => useGetCurrentCurrencyRateQuery(), {
      wrapper: Wrapper,
    });

    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getCurrentCurrencyRate',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toMatchObject({
      status: 'fulfilled',
      endpointName: 'getCurrentCurrencyRate',
      data: {},
      isLoading: false,
      isSuccess: true,
      isError: false,
      currentData: {},
      isFetching: false,
    });
  });

  it('renders skeleton while waiting for the data from websocket', () => {
    render(
      <Wrapper>
        <RealTimeRateChanges />
      </Wrapper>,
    );

    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });

  // test('should render component and update with WebSocket data', async () => {
  //   const ws = new WS('ws://localhost:8080', { jsonProtocol: true });
  //
  //   render(
  //     <Wrapper>
  //       <ThemeProvider theme={theme}>
  //         <RealTimeRateChanges />
  //       </ThemeProvider>
  //     </Wrapper>,
  //   );
  //
  //   console.log('before connected');
  //   await ws.connected;
  //   console.log('after connected');
  //
  //   const mockData = {
  //     payload: {
  //       type: 'EXCHANGE_RATE_CHANGE',
  //       from: 'USD',
  //       to: 'EUR',
  //       rate: 1.2,
  //       change: 1,
  //     },
  //     error: '',
  //   };
  //
  //   ws.send(mockData);
  //
  //   await waitFor(() => {
  //     expect(screen.getByText(/Real-time exchange rate changes/i)).toBeInTheDocument();
  //     expect(screen.getByText('USD/EUR')).toBeInTheDocument();
  //     expect(screen.getByText('1.2')).toBeInTheDocument();
  //   });
  // });

  it('should render component with mock data', () => {
    const mockData = {
      type: 'EXCHANGE_RATE_CHANGE',
      from: 'USD',
      to: 'EUR',
      rate: 1.2,
      change: 1,
    };

    render(
      <Wrapper>
        <ThemeProvider theme={theme}>
          <RealTimeRateChanges rateData={mockData} />
        </ThemeProvider>
      </Wrapper>,
    );

    expect(screen.getByText(/Real-time exchange rate changes/i)).toBeInTheDocument();
    expect(screen.getByText('USD/EUR')).toBeInTheDocument();
    expect(screen.getByText('1.2')).toBeInTheDocument();
  });
});
