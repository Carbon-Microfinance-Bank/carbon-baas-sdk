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
export declare function initiatePayout(payoutData: InitiatePayoutRequest): Promise<any>;
export declare function fetchPayout(payoutId: string): Promise<any>;
export {};
