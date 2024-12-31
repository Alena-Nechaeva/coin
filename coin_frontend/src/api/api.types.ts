export type TLoginResponse = {
  payload: {
    token: string;
  };
  error: string;
};

export type TTransaction = {
  amount: number;
  date: string;
  from: string;
  to: string;
};

export type TPayload = {
  account: string;
  balance: number;
  mine: true;
  transactions: TTransaction[];
};

export type TAccounts = {
  payload: TPayload[];
  error: string;
};

export type TTransactionId = TTransaction & {
  id: number;
};

export type TAccount = { payload: Omit<TPayload, 'mine'>; error: string };

export type TUserCurrency = {
  [key: string]: {
    amount: number;
    code: string;
  };
};

export type TCurrentCurrencyRate = {
  type: string;
  from: string;
  to: string;
  rate: number | null;
  change: number | null;
};

export type TATMCoordinates = {
  lat: number;
  lon: number;
};
