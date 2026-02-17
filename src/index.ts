import axios, { AxiosInstance } from 'axios';
import { CONFIG } from './config';

let instance: AxiosInstance;

export function initialize(apiKey: string, mode: 'live' | 'sandbox') {
  if (!CONFIG[mode]) {
    throw new Error(`Invalid mode: ${mode}. Must be 'live' or 'sandbox'`);
  }
  
  const { baseUrl, accessKey } = CONFIG[mode];

  if (!apiKey) {
    throw new Error('API key must be provided');
  }
  
  instance = axios.create({
    baseURL: baseUrl,
    headers: {
      'x-carbon-key': apiKey,
      'apiKey': accessKey,
    },
  });
}

export function getInstance(): AxiosInstance {
  if (!instance) {
    throw new Error('SDK not initialized. Call initialize() first.');
  }
  return instance;
}

export { createAccount, fetchAccount, fetchAccounts, fetchAccountBalance } from './accounts';
export { verifyTransaction, fetchTransactions } from './transactions';
export { createCustomer, fetchCustomer, fetchCustomers } from './customers';
export { initiatePayout, fetchPayout, fetchPayoutsWithPendingApprovals } from './payouts';
export { fetchBanks, fetchBanksUptime, resolveAccount } from './banks';
export { fetchWebhookHistory, resendWebhookEvent } from './webhook';
