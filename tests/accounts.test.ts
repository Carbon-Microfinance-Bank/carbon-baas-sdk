import { createAccount, fetchAccount, fetchAccounts } from '../src/accounts';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import axios from 'axios';

// Mock the getInstance function instead of axios directly
jest.mock('../src/index', () => ({
  getInstance: () => axios,
}));

// Now mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Account API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create an account for a third-party customer', async () => {
      const accountData = {
        account_type: "static" as const,
        third_party: true,
        customer_id: '1732ca47-42b2-4990-a65d-c369e934eed3'
      };

      const responseData = { 
        status: 'success',
        data: { 
          account_number: '1234567890', 
          account_name: 'John Doe',
          ...accountData 
        } 
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: responseData });

      const result = await createAccount(accountData);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/accounts', accountData);
    });

    it('should create a sub-account for the business itself', async () => {
      const accountData = {
        account_type: "static" as const,
        third_party: false,
        account_name: 'Collections'
      };

      const responseData = { 
        status: 'success',
        data: { 
          account_number: '0987654321', 
          business_name: 'BUSINESS NAME',
          ...accountData 
        } 
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: responseData });

      const result = await createAccount(accountData);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/accounts', accountData);
    });

    it('should handle API errors during account creation', async () => {
      const accountData = {
        account_type: "static" as const,
        third_party: true,
        // Missing customer_id which is required when third_party is true
      };

      const errorResponse = {
        response: {
          data: {
            status: 'failed',
            message: 'bad request',
            errors: [
              { msg: 'customer_id is required when third_party is true', param: 'customer_id' }
            ],
          },
        },
      };

      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      const result = await createAccount(accountData);
      expect(result).toEqual(errorResponse.response.data);
    });
  });

  describe('fetchAccount', () => {
    it('should fetch a single account by account number', async () => {
      const accountNumber = '1234567890';
      const responseData = { 
        status: 'success',
        data: { 
          account_number: accountNumber, 
          account_name: 'John Doe',
          account_type: 'static',
          balance: '10000.00'
        } 
      };
      
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchAccount(accountNumber);
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith(`/v1/accounts/${accountNumber}`);
    });

    it('should handle API errors when fetching an account', async () => {
      const accountNumber = 'invalid-account';
      const errorResponse = {
        response: {
          data: {
            status: 'failed',
            message: 'Account not found',
          },
        },
      };

      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      const result = await fetchAccount(accountNumber);
      expect(result).toEqual(errorResponse.response.data);
    });
  });

  describe('fetchAccounts', () => {
    it('should fetch all accounts with default pagination', async () => {
      const responseData = { 
        status: 'success',
        data: { 
          accounts: [
            { account_number: '1234567890', account_name: 'John Doe', account_type: 'static' },
            { account_number: '0987654321', account_name: 'Jane Smith', account_type: 'static' }
          ],
          pagination: {
            total: 2,
            page: 1,
            limit: 10
          }
        } 
      };
      
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchAccounts();
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/accounts', { params: { page: 1, limit: 10 } });
    });

    it('should fetch accounts with custom pagination', async () => {
      const page = 2;
      const limit = 5;
      const responseData = { 
        status: 'success',
        data: { 
          accounts: [
            { account_number: '1112223334', account_name: 'Alice Johnson', account_type: 'static' },
            { account_number: '5556667778', account_name: 'Bob Miller', account_type: 'static' }
          ],
          pagination: {
            total: 7,
            page: page,
            limit: limit
          }
        } 
      };
      
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchAccounts(page, limit);
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/accounts', { params: { page, limit } });
    });

    it('should handle API errors when fetching accounts', async () => {
      const errorResponse = {
        response: {
          data: {
            status: 'failed',
            message: 'Unauthorized access',
          },
        },
      };

      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      const result = await fetchAccounts();
      expect(result).toEqual(errorResponse.response.data);
    });
  });
});
