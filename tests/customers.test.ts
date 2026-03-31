import { createCustomer, fetchCustomer, fetchCustomers } from '../src/customers';
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

  it('should fetch customers with no params', async () => {
    const responseData = { status: 'success', message: 'Customers fetched successfully', data: [], total: 0, page: 1, limit: 10 };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetchCustomers();
    expect(result).toEqual(responseData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/v1/customers', { params: {} });
  });

  it('should fetch customers with pagination params', async () => {
    const responseData = { status: 'success', message: 'Customers fetched successfully', data: [], total: 0, page: 2, limit: 5 };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetchCustomers({ page: 2, limit: 5 });
    expect(result).toEqual(responseData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/v1/customers', { params: { page: 2, limit: 5 } });
  });

  it('should fetch customers filtered by bvn', async () => {
    const responseData = { status: 'success', message: 'Customers fetched successfully', data: [], total: 1, page: 1, limit: 10, filters_applied: { bvn: '11111011116' } };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetchCustomers({ bvn: '11111011116' });
    expect(result).toEqual(responseData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/v1/customers', { params: { bvn: '11111011116' } });
  });

  it('should fetch customers filtered by email', async () => {
    const responseData = { status: 'success', message: 'Customers fetched successfully', data: [], total: 1, page: 1, limit: 10 };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetchCustomers({ email: 'john.doe@example.com' });
    expect(result).toEqual(responseData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/v1/customers', { params: { email: 'john.doe@example.com' } });
  });

  it('should fetch customers filtered by gender', async () => {
    const responseData = { status: 'success', message: 'Customers fetched successfully', data: [], total: 3, page: 1, limit: 10 };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetchCustomers({ gender: 'MALE' });
    expect(result).toEqual(responseData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/v1/customers', { params: { gender: 'MALE' } });
  });

  it('should fetch customers filtered by phone', async () => {
    const responseData = { status: 'success', message: 'Customers fetched successfully', data: [], total: 1, page: 1, limit: 10 };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetchCustomers({ phone: '08071000030' });
    expect(result).toEqual(responseData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/v1/customers', { params: { phone: '08071000030' } });
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