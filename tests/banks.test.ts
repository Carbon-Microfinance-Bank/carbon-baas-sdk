import { fetchBanks, resolveAccount, fetchBanksUptime } from '../src/banks';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import axios from 'axios';

jest.mock('../src/index', () => ({
  getInstance: () => axios,
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Banks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchBanks', () => {
    it('should fetch a list of banks', async () => {
      const responseData = {
        status: 'success',
        data: [
          { name: 'Guaranty Trust Bank', code: '058' },
          { name: 'First Bank of Nigeria', code: '011' },
        ],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchBanks();
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/banks');
    });

    it('should handle errors when fetching banks', async () => {
      const errorResponse = { response: { data: { status: 'failed', message: 'Service unavailable' } } };
      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      const result = await fetchBanks();
      expect(result).toEqual(errorResponse.response.data);
    });
  });

  describe('resolveAccount', () => {
    it('should resolve an account number', async () => {
      const accountData = { account_number: '0987654321', bank_code: '058' };
      const responseData = { status: 'success', data: { account_name: 'John Doe', account_number: '0987654321', bank_code: '058' } };
      mockedAxios.post.mockResolvedValueOnce({ data: responseData });

      const result = await resolveAccount(accountData);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/banks/resolve', accountData);
    });

    it('should handle errors when resolving an account', async () => {
      const errorResponse = { response: { data: { status: 'failed', message: 'Account not found' } } };
      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      const result = await resolveAccount({ account_number: 'invalid', bank_code: '058' });
      expect(result).toEqual(errorResponse.response.data);
    });
  });

  describe('fetchBanksUptime', () => {
    it('should fetch banks uptime', async () => {
      const responseData = {
        status: 'success',
        data: [
          { cbnBankCode: '058', nipBankCode: '058', uptime: 99.9 },
          { cbnBankCode: '011', nipBankCode: '011', uptime: 98.5 },
        ],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchBanksUptime();
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/banks/uptime');
    });

    it('should handle errors when fetching banks uptime', async () => {
      const errorResponse = { response: { data: { status: 'failed', message: 'Service unavailable' } } };
      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      const result = await fetchBanksUptime();
      expect(result).toEqual(errorResponse.response.data);
    });
  });
});
