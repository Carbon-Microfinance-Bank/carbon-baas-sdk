import { initiatePayout, fetchPayout, fetchPayoutsWithPendingApprovals, approveOrDeclinePayout, merchantFeeCharge } from '../src/payouts';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import axios from 'axios';

jest.mock('../src/index', () => ({
  getInstance: () => axios,
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Payout API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initiatePayout', () => {
    it('should initiate a payout', async () => {
      const payoutData = {
        amount: 1000,
        source: { account_number: '1234567890' },
        beneficiary: {
          bank_code: '058',
          bank_name: 'GTB',
          account_number: '0987654321',
          account_name: 'John Doe',
        },
        reference: 'payout_ref_123',
        meta_data: { description: 'Payment for services' },
        remark: 'Service payment',
      };

      const responseData = { status: 'success', message: 'Payout initiated', data: { id: 'payout_123', ...payoutData } };
      mockedAxios.post.mockResolvedValueOnce({ data: responseData });

      const result = await initiatePayout(payoutData);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/payouts', payoutData);
    });

    it('should handle errors when initiating a payout', async () => {
      const payoutData = {
        amount: -100,
        source: { account_number: '1234567890' },
        beneficiary: { bank_code: '058', bank_name: 'GTB', account_number: '0987654321', account_name: 'John Doe' },
        reference: 'ref_123',
        meta_data: {},
        remark: 'test',
      };

      const errorResponse = { response: { data: { status: 'failed', message: 'Amount must be positive' } } };
      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      const result = await initiatePayout(payoutData);
      expect(result).toEqual(errorResponse.response.data);
    });
  });

  describe('fetchPayout', () => {
    it('should fetch a payout by ID', async () => {
      const payoutId = 'payout_123';
      const responseData = { status: 'success', data: { id: payoutId, amount: 1000, status: 'completed' } };
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchPayout(payoutId);
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith(`/v1/payouts/${payoutId}`);
    });

    it('should handle errors when fetching a payout', async () => {
      const errorResponse = { response: { data: { status: 'failed', message: 'Payout not found' } } };
      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      const result = await fetchPayout('invalid_id');
      expect(result).toEqual(errorResponse.response.data);
    });
  });

  describe('fetchPayoutsWithPendingApprovals', () => {
    it('should fetch pending approvals with default param', async () => {
      const responseData = { status: 'success', data: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchPayoutsWithPendingApprovals();
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/payouts/approvals?include_expired=false');
    });

    it('should fetch pending approvals including expired', async () => {
      const responseData = { status: 'success', data: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: responseData });

      const result = await fetchPayoutsWithPendingApprovals(true);
      expect(result).toEqual(responseData);
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/payouts/approvals?include_expired=true');
    });
  });

  describe('approveOrDeclinePayout', () => {
    it('should approve a payout', async () => {
      const data = { authCode: 'TRF-1771341301552SNKED', action: 'approve' as const };
      const responseData = { status: 'success', message: 'Payout approved' };
      mockedAxios.post.mockResolvedValueOnce({ data: responseData });

      const result = await approveOrDeclinePayout(data);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/payouts/approvals/approve', data);
    });

    it('should decline a payout with a reason', async () => {
      const data = { authCode: 'TRF-1771341301552SNKED', action: 'decline' as const, reason: 'Insufficient documentation' };
      const responseData = { status: 'success', message: 'Payout declined' };
      mockedAxios.post.mockResolvedValueOnce({ data: responseData });

      const result = await approveOrDeclinePayout(data);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/payouts/approvals/approve', data);
    });

    it('should handle errors when approving a payout', async () => {
      const errorResponse = { response: { data: { status: 'failed', message: 'Invalid auth code' } } };
      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      const result = await approveOrDeclinePayout({ authCode: 'INVALID', action: 'approve' });
      expect(result).toEqual(errorResponse.response.data);
    });
  });

  describe('merchantFeeCharge', () => {
    it('should process a merchant fee charge', async () => {
      const data = { amount: 10, sourceAccountId: '0340899287', targetAccountId: '6009490194', description: 'Fee Charge of N100' };
      const responseData = {
        status: 'success',
        message: 'Merchant fee charge processed successful...',
        data: {
          success: true,
          statusCode: '00',
          transaction: { uniqueRef: '177383661255062352', internalRef: '1406812', amount: 1000, transactionType: 'DEBIT', accountId: '0340899287' },
        },
      };
      mockedAxios.post.mockResolvedValueOnce({ data: responseData });

      const result = await merchantFeeCharge(data);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/payouts/merchant-fee-charge', data);
    });

    it('should process a merchant fee charge without description', async () => {
      const data = { amount: 50, sourceAccountId: '0340899287', targetAccountId: '6009490194' };
      const responseData = { status: 'success', data: { success: true, statusCode: '00' } };
      mockedAxios.post.mockResolvedValueOnce({ data: responseData });

      const result = await merchantFeeCharge(data);
      expect(result).toEqual(responseData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/payouts/merchant-fee-charge', data);
    });

    it('should handle errors when processing a merchant fee charge', async () => {
      const errorResponse = { response: { data: { status: 'failed', message: 'invalid source account' } } };
      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      const result = await merchantFeeCharge({ amount: 10, sourceAccountId: 'invalid', targetAccountId: '6009490194' });
      expect(result).toEqual(errorResponse.response.data);
    });
  });
});
