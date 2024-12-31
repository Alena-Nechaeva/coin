import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAccount, TAccounts, TATMCoordinates, TCurrentCurrencyRate, TLoginResponse, TUserCurrency } from '@/api/api.types';

export const bankApi = createApi({
  reducerPath: 'bankApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    prepareHeaders: headers => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('authorization', `Basic ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Accounts', 'Account', 'Currencies'],

  endpoints: build => ({
    login: build.mutation<TLoginResponse, { login: string; password: string }>({
      query: ({ login, password }) => {
        return {
          url: '/login',
          method: 'POST',
          body: { login, password },
        };
      },
    }),
    getAccounts: build.query<TAccounts, void>({
      query: () => '/accounts',
      providesTags: ['Accounts'],
    }),
    getAccount: build.query<TAccount, string>({
      query: account => `/account/${account}`,
      providesTags: ['Account'],
    }),
    addAccount: build.mutation<any, void>({
      query: () => {
        return {
          url: '/create-account',
          method: 'POST',
        };
      },
      invalidatesTags: result => (result ? ['Accounts'] : []),
    }),
    transferFunds: build.mutation<any, { from: string; to: string; amount: number }>({
      query: transferData => {
        return {
          url: '/transfer-funds',
          method: 'POST',
          body: transferData,
        };
      },
      invalidatesTags: result => (result ? ['Account'] : []),
    }),
    getUserCurrencies: build.query<{ payload: TUserCurrency; error: string }, void>({
      query: () => `/currencies`,
      providesTags: ['Currencies'],
    }),
    getAllCurrencies: build.query<{ payload: string[]; error: string }, void>({
      query: () => `/all-currencies`,
    }),
    exchangeCurrency: build.mutation<any, { from: string; to: string; amount: number }>({
      query: exchangeData => {
        return {
          url: '/currency-buy',
          method: 'POST',
          body: exchangeData,
        };
      },
      invalidatesTags: result => (result ? ['Currencies'] : []),
    }),
    getCurrentCurrencyRate: build.query<{ payload: TCurrentCurrencyRate; error: string }, void>({
      queryFn: () => ({
        data: {
          payload: {
            type: '',
            from: '',
            to: '',
            rate: null,
            change: null,
          },
          error: '',
        },
      }),
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const ws = new WebSocket('ws://localhost:8080/currency-feed');
        try {
          await cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            updateCachedData(draft => {
              Object.assign(draft.payload, data);
            });
          };
          ws.addEventListener('message', listener);
        } catch (error) {
          console.error('WebSocket error:', error);
        }
        await cacheEntryRemoved;
        ws.close();
      },
    }),
    getAtms: build.query<{ payload: TATMCoordinates[]; error: string }, void>({
      query: () => `/banks`,
    }),
  }),
});

export const {
  useLoginMutation,
  useGetAccountsQuery,
  useAddAccountMutation,
  useGetAccountQuery,
  useTransferFundsMutation,
  useGetUserCurrenciesQuery,
  useExchangeCurrencyMutation,
  useGetCurrentCurrencyRateQuery,
  useGetAtmsQuery,
  useGetAllCurrenciesQuery,
} = bankApi;
