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
export declare function initiatePayout(payoutData: InitiatePayoutRequest): Promise<any>;
export declare function fetchPayout(payoutId: string): Promise<any>;
export declare function fetchPayoutsWithPendingApprovals(includeExpired?: boolean): Promise<any>;
interface PayoutApprovalRequest {
    authCode: string;
    action: 'approve' | 'decline';
    reason?: string;
}
export declare function approveOrDeclinePayout(data: PayoutApprovalRequest): Promise<any>;
export declare function merchantFeeCharge(data: MerchantFeeChargeRequest): Promise<any>;
export {};
