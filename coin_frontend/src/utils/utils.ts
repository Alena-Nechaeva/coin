import { TAccount } from '@/api/api.types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const generateRandomString = () => Math.random().toString(36).substring(2, 15);

export const getNiceBalance = (balance: number) => {
  return `${Math.floor(balance).toLocaleString('ru-RU', { useGrouping: true }).replace(/,/g, ' ')} ₽`;
};

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getLastSixMonthBalance(): { month: string; amount: number }[] {
  const today = new Date();
  const todayMonth = new Date().getMonth() + 1;
  const sixMonthsAgoMs = new Date(today);
  sixMonthsAgoMs.setMonth(today.getMonth() - 6);
  const sixMonthsAgoMonth = sixMonthsAgoMs.getMonth() + 1;

  return monthNames.slice(sixMonthsAgoMonth, todayMonth).reduce((acc: { month: string; amount: number }[], item) => {
    acc.push({ month: item, amount: 0 });
    return acc;
  }, []);
}

export function getLastTwelveMonthBalance(): { month: string; amount: number }[] {
  const today = new Date();
  const todayMonthIndex = today.getMonth();
  const lastTwelveMonths = [];

  for (let i = 0; i < 12; i++) {
    const monthIndex = (todayMonthIndex - i + 12) % 12;
    lastTwelveMonths.unshift({ month: monthNames[monthIndex], amount: 0 });
  }

  return lastTwelveMonths;
}

export function getLastTwelveMonthIncomeOutcome(): { month: string; income: number; outcome: number }[] {
  const today = new Date();
  const todayMonthIndex = today.getMonth();
  const lastTwelveMonths = [];

  for (let i = 0; i < 12; i++) {
    const monthIndex = (todayMonthIndex - i + 12) % 12;
    lastTwelveMonths.unshift({ month: monthNames[monthIndex], income: 0, outcome: 0 });
  }

  return lastTwelveMonths;
}

export function getBalanceTransactions(
  data: TAccount,
  period: number,
  account: string,
  balance: number,
): { month: string; amount: number }[] {
  const today = new Date();
  const monthsAgo = new Date(today);
  monthsAgo.setMonth(today.getMonth() - period);

  const lastTransactions = data.payload.transactions.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= monthsAgo && itemDate <= today;
  });

  // const realBalance = lastTransactions.reduce((acc, item) => {
  //   if (item.from === account) {
  //     acc -= item.amount;
  //   } else {
  //     acc += item.amount;
  //   }
  //   return acc;
  // }, 0);
  //
  // const previousBalance = balance - realBalance;

  const previousTransactions = data.payload.transactions.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate < monthsAgo;
  });

  const previousBalance = previousTransactions.reduce((acc, item) => {
    if (item.from === account) {
      acc -= item.amount;
    } else {
      acc += item.amount;
    }
    return acc;
  }, 0);

  return lastTransactions.reduce(
    (acc, item) => {
      const transactionMonthIndex = new Date(item.date).getMonth();
      const transactionMonthName = monthNames[transactionMonthIndex];
      let currentMonth = acc.find(el => el.month === transactionMonthName);

      if (!currentMonth) {
        const previousMonthIndex = acc.length > 0 ? acc.length - 1 : -1;
        const previousAmount = previousMonthIndex >= 0 ? acc[previousMonthIndex].amount : previousBalance > 0 ? previousBalance : 0;
        currentMonth = { month: transactionMonthName, amount: previousAmount };
        acc.push(currentMonth);
      }

      if (item.from === account && currentMonth) {
        currentMonth.amount -= item.amount;
      } else if (item.to === account && currentMonth) {
        currentMonth.amount += item.amount;
      }
      return acc;
    },
    [] as { month: string; amount: number }[],
  );
}

export function getIncomeOutcomeTransactions(data: TAccount, account: string) {
  const today = new Date();
  const monthsAgo = new Date(today);
  monthsAgo.setMonth(today.getMonth() - 12);

  const lastTransactions = data.payload.transactions.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= monthsAgo && itemDate <= today;
  });

  return lastTransactions.reduce(
    (acc, item) => {
      const monthIndex = new Date(item.date).getMonth();
      const monthName = monthNames[monthIndex];
      let currentMonth = acc.find(el => el.month === monthName);

      if (!currentMonth) {
        currentMonth = { month: monthName, income: 0, outcome: 0 };
        acc.push(currentMonth);
      }

      if (item.from === account) {
        currentMonth.outcome += item.amount;
      } else if (item.to === account) {
        currentMonth.income += item.amount;
      }
      return acc;
    },
    [] as { month: string; income: number; outcome: number }[],
  );
}

export function checkToken(router: AppRouterInstance, link: string) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    router.push('/login');
  } else {
    router.push(`${link}`);
  }
}

export function formatCurrencyNumbers(number: number): string {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

export const detectCardType = (cardNumber: string): string | null => {
  const patterns = {
    visa: /^4[0-9]{0,15}$/,
    mastercard: /^5[1-5][0-9]{0,14}$/,
    amex: /^3[47][0-9]{0,13}$/,
    mir: /^220[0-4][0-9]{0,15}$/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type;
    }
  }

  return null;
};
