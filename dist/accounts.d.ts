interface CreateAccountRequest {
    customer_id: string;
    account_type: string;
}
export declare function createAccount(accountData: CreateAccountRequest): Promise<any>;
export declare function fetchAccount(accountNumber: string): Promise<any>;
export declare function fetchAccounts(page?: number, limit?: number): Promise<any>;
export {};
