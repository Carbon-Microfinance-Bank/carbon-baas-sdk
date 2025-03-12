interface ResolveAccountRequest {
    account_number: string;
    bank_code: string;
}
export declare function fetchBanks(): Promise<any>;
export declare function resolveAccount(accountData: ResolveAccountRequest): Promise<any>;
export declare function fetchBanksUptime(): Promise<any>;
export {};
