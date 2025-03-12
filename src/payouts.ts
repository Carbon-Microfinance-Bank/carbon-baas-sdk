import { getInstance } from './index';
import { handleError } from './util';

interface InitiatePayoutRequest {
  amount: number;
  source: {
    account_number: string;
  };
  beneficiary: {
    bank_code: string;
    bank_name: string;
    account_number: string;
    account_name: string;
  };
  reference: string;
  meta_data: object;
  remark: string;
}

export async function initiatePayout(payoutData: InitiatePayoutRequest) {
  try {
    const response = await getInstance().post('/v1/payouts', payoutData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchPayout(payoutId: string) {
  try {
    const response = await getInstance().get(`/v1/payouts/${payoutId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}