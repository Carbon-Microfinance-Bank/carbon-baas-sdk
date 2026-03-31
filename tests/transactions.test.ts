import { verifyTransaction, fetchTransactions } from '../src/transactions';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import axios from 'axios';

jest.mock('../src/index', () => ({
  getInstance: () => axios,
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Transactions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyTransaction', () => {
    it('should verify a transaction', async () => {
      const accountNumber = '1234567890';
      const reference = 'TXN_REF_123';
      const responseData = {
        status: 'success',
        data: { reference, amount: 5000, status: 'successful', accountNumber },
      };
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await verifyTransaction(accountNumber, reference);
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith(`/v1/accounts/${accountNumber}/transactions/${reference}`);
    });

    it('should handle errors when verifying a transaction', async () => {
      const errorResponse = { response: { data: { status: 'failed', message: 'Transaction not found' } } };
      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      const result = await verifyTransaction('1234567890', 'INVALID_REF');
      expect(result).toEqual(errorResponse.response.data);
    });
  });

  describe('fetchTransactions', () => {
    it('should fetch transactions with default pagination', async () => {
      const accountNumber = '1234567890';
      const responseData = {
        status: 'success',
        data: [
          { reference: 'TXN_001', amount: 1000, transactionType: 'CREDIT' },
          { reference: 'TXN_002', amount: 500, transactionType: 'DEBIT' },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchTransactions(accountNumber);
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith(`/v1/accounts/${accountNumber}/transactions`, { params: { page: 1, limit: 10 } });
    });

    it('should fetch transactions with custom pagination', async () => {
      const accountNumber = '1234567890';
      const responseData = { status: 'success', data: [], total: 0, page: 2, limit: 5 };
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchTransactions(accountNumber, 2, 5);
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith(`/v1/accounts/${accountNumber}/transactions`, { params: { page: 2, limit: 5 } });
    });

    it('should handle errors when fetching transactions', async () => {
      const errorResponse = { response: { data: { status: 'failed', message: 'Account not found' } } };
      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      const result = await fetchTransactions('invalid_account');
      expect(result).toEqual(errorResponse.response.data);
    });
  });
});
