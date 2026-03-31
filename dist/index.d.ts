import { AxiosInstance } from 'axios';
export declare function initialize(apiKey: string, mode: 'live' | 'sandbox'): void;
export declare function getInstance(): AxiosInstance;
export { createAccount, fetchAccount, fetchAccounts, fetchAccountBalance } from './accounts';
export { verifyTransaction, fetchTransactions } from './transactions';
export { createCustomer, fetchCustomer, fetchCustomers } from './customers';
export { initiatePayout, fetchPayout, fetchPayoutsWithPendingApprovals, approveOrDeclinePayout, merchantFeeCharge } from './payouts';
export { fetchBanks, fetchBanksUptime, resolveAccount } from './banks';
export { fetchWebhookHistory, resendWebhookEvent } from './webhook';
