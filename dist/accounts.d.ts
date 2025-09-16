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
export declare function createAccount(accountData: CreateAccountRequest): Promise<any>;
export declare function fetchAccount(accountNumber: string): Promise<any>;
export declare function fetchAccounts(page?: number, limit?: number): Promise<any>;
export {};
