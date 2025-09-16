import { getInstance } from './index';
import { handleError } from './util';

interface CreateAccountRequest {
  /** Must always be "static". */
  account_type: "static";
  
  /** 
   * Set to true when creating an account for a third-party customer (business use).
   * Set to false when creating a sub-account for your own business (collections).
   * Defaults to true if not provided.
   */
  third_party?: boolean;
  
  /** Required if third_party is true. The customer to associate the account with. */
  customer_id?: string;
  
  /** Required if third_party is false. The sub-account name (e.g."SUBACCOUNT" -> BUSINESS NAME - SUBACCOUNT). */
  account_name?: string;
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

