import { configureStore } from '@reduxjs/toolkit';
import { bankSlice } from '@/components/componentsStore';
import { bankApi } from '@/api/api';

export const store = configureStore({
  reducer: {
    bank: bankSlice.reducer,
    [bankApi.reducerPath]: bankApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({}).concat(bankApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
