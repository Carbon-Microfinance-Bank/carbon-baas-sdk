import { getInstance } from './index';
import { handleError } from './util';

interface CreateAccountRequest {
  customer_id: string;
  account_type: string;
}

export async function createAccount(accountData: CreateAccountRequest) {
  try {
    const response = await getInstance().post('/v1/accounts', accountData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchAccount(accountNumber: string) {
  try {
    const response = await getInstance().get(`/v1/accounts/${accountNumber}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchAccounts(page: number = 1, limit: number = 10) {
  try {
    const response = await getInstance().get(`/v1/accounts`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

