import {
  generateRandomString,
  getNiceBalance,
  getLastSixMonthBalance,
  getLastTwelveMonthBalance,
  getLastTwelveMonthIncomeOutcome,
  getBalanceTransactions,
  getIncomeOutcomeTransactions,
  checkToken,
  formatCurrencyNumbers,
  detectCardType,
} from '../utils';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { TAccount } from '@/api/api.types';

describe('utils.ts tests', () => {
  const mockRouter = { push: jest.fn() } as unknown as AppRouterInstance;
  beforeEach(() => {
    global.localStorage.clear();
  });

  // 1. generateRandomString
  it('should generate a random string', () => {
    const result = generateRandomString();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThanOrEqual(10);
    expect(result.length).toBeLessThanOrEqual(13);
  });

  // 2. getNiceBalance
  it('should format a balance correctly', () => {
    const balance = 12345.67;
    const formatted = getNiceBalance(balance);
    expect(formatted.replace(/\u00A0/g, ' ')).toBe('12 345 ₽');
  });

  // 3. getLastSixMonthBalance
  it('should return the last six months with amount 0', () => {
    const result = getLastSixMonthBalance();
    expect(result).toHaveLength(6);
    result.forEach(entry => {
      expect(entry).toHaveProperty('month');
      expect(entry).toHaveProperty('amount', 0);
    });
  });

  // 4. getLastTwelveMonthBalance
  it('should return the last twelve months with amount 0', () => {
    const result = getLastTwelveMonthBalance();
    expect(result).toHaveLength(12);
    result.forEach(entry => {
      expect(entry).toHaveProperty('month');
      expect(entry).toHaveProperty('amount', 0);
    });
  });

  // 5. getLastTwelveMonthIncomeOutcome
  it('should return the last twelve months with income and outcome set to 0', () => {
    const result = getLastTwelveMonthIncomeOutcome();
    expect(result).toHaveLength(12);
    result.forEach(entry => {
      expect(entry).toHaveProperty('month');
      expect(entry).toHaveProperty('income', 0);
      expect(entry).toHaveProperty('outcome', 0);
    });
  });

  // 6. getBalanceTransactions
  it('should calculate balance transactions correctly', () => {
    const data = {
      payload: {
        transactions: [
          {
            amount: 100,
            date: '2024-11-11T18:11:34.203Z',
            from: '123',
            to: '456',
          },
          {
            amount: 100,
            date: '2024-12-11T18:11:45.244Z',
            from: '456',
            to: '123',
          },
        ],
      },
    };
    const result = getBalanceTransactions(data as TAccount, 2, '123', 1000);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });

  // 7. getIncomeOutcomeTransactions
  it('should calculate income and outcome for transactions period', () => {
    const data = {
      payload: {
        account: '123456789',
        balance: 500,
        transactions: [
          {
            amount: 100,
            date: '2024-11-11T18:11:34.203Z',
            from: '123',
            to: '456',
          },
          {
            amount: 200,
            date: '2024-12-11T18:11:45.244Z',
            from: '456',
            to: '123',
          },
        ],
      },
      error: '',
    };
    const result = getIncomeOutcomeTransactions(data, '123');
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
    expect(result[0].outcome).toBe(100);
    expect(result[1].income).toBe(200);
  });

  // 8. checkToken
  it('should redirect to login-page if no token is found', () => {
    checkToken(mockRouter, '/test');
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('should redirect to provided link if token is present', () => {
    localStorage.setItem('accessToken', 'test-token');
    checkToken(mockRouter, '/test');
    expect(mockRouter.push).toHaveBeenCalledWith('/test');
  });

  // 9. formatCurrencyNumbers
  it('should format currency numbers with spaces', () => {
    const result = formatCurrencyNumbers(1234567.89);
    expect(result).toBe('1 234 567.89');
  });

  // 10. detectCardType
  it('should detect Visa card type', () => {
    expect(detectCardType('4111111111111111')).toBe('visa');
  });

  it('should detect Visa card type', () => {
    expect(detectCardType('5111111111111111')).toBe('mastercard');
  });

  it('should return null for invalid card numbers', () => {
    expect(detectCardType('99999')).toBeNull();
  });
});
