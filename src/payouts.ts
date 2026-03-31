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

interface MerchantFeeChargeRequest {
  amount: number;
  sourceAccountId: string;
  targetAccountId: string;
  description?: string;
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
export async function fetchPayoutsWithPendingApprovals(includeExpired: boolean = false) {
  try {
    const response = await getInstance().get(`/v1/payouts/approvals?include_expired=${includeExpired}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

interface PayoutApprovalRequest {
  authCode: string;
  action: 'approve' | 'decline';
  reason?: string;
}

export async function approveOrDeclinePayout(data: PayoutApprovalRequest) {
  try {
    const response = await getInstance().post('/v1/payouts/approvals/approve', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function merchantFeeCharge(data: MerchantFeeChargeRequest) {
  try {
    const response = await getInstance().post('/v1/payouts/merchant-fee-charge', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}