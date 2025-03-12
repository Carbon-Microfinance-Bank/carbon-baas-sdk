import { createCustomer, fetchCustomer } from '../src/customers';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import axios from 'axios';

// Mock the getInstance function instead of axios directly
jest.mock('../src/index', () => ({
  getInstance: () => axios,
}));

// Now mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Customer API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should create a customer', async () => {
    const customerData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      dob: '1990-01-01',
      gender: 'male',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      country: 'US',
      bvn: '1234567890',
      nin: '1234567890',
    };

    const responseData = { data: { id: '123', ...customerData } };
    mockedAxios.post.mockResolvedValueOnce({ data: responseData });

    const result = await createCustomer(customerData);
    expect(result).toEqual(responseData);
    expect(mockedAxios.post).toHaveBeenCalledWith('/v1/customers', customerData);
  });

  it('should fetch a customer', async () => {
    const customerId = '123';
    const responseData = { data: { id: customerId, first_name: 'John', last_name: 'Doe' } };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetchCustomer(customerId);
    expect(result).toEqual(responseData);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/v1/customers/${customerId}`);
  });

  it('should handle API errors', async () => {
    const customerData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      dob: '1990-01-01',
      gender: 'male',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      country: 'US',
      bvn: '1234567890',
      nin: '1234567890',
    };

    const errorResponse = {
      response: {
        data: {
          status: 'failed',
          message: 'bad request',
          errors: [
            { msg: 'BVN must be 11 numbers long', param: 'bvn' },
            { msg: 'NIN must be 11 numbers long', param: 'nin' },
          ],
        },
      },
    };

    mockedAxios.post.mockRejectedValueOnce(errorResponse);

    const result = await createCustomer(customerData);
    expect(result).toEqual(errorResponse.response.data);
  });
});