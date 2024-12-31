import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';

export const bankSlice = createSlice({
  name: 'bank',
  initialState: { currentAccount: '' },
  reducers: {
    setCurrentAccount: (state, data: PayloadAction<string>) => {
      state.currentAccount = data.payload;
    },
  },
});

export const { setCurrentAccount } = bankSlice.actions;

export const currentAccountSelect = (state: RootState) => state.bank.currentAccount;

export default bankSlice.reducer;
