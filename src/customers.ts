import axios from 'axios';
import { getInstance } from './index';
import { handleError } from './util';

interface CreateCustomerRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  street: string;
  city: string;
  state: string;
  country: string;
  bvn: string;
  nin?: string;
}

export async function createCustomer(customerData: CreateCustomerRequest) {
  try {
    const response = await getInstance().post('/v1/customers', customerData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchCustomer(customerId: string) {
  try {
    const response = await getInstance().get(`/v1/customers/${customerId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

interface FetchCustomersParams {
  page?: number;
  limit?: number;
  gender?: string;
  email?: string;
  bvn?: string;
  phone?: string;
}

export async function fetchCustomers(params: FetchCustomersParams = {}) {
  try {
    const response = await getInstance().get('/v1/customers', { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
