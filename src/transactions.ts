import { getInstance } from './index';
import { handleError } from './util';

export async function verifyTransaction(accountNumber: string, reference: string) {
  try {
    const response = await getInstance().get(`/v1/accounts/${accountNumber}/transactions/${reference}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchTransactions(accountNumber: string, page: number = 1, limit: number = 10) {
  try {
    const response = await getInstance().get(`/v1/accounts/${accountNumber}/transactions`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
