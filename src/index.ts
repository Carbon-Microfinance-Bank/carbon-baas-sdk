import axios, { AxiosInstance } from 'axios';

let instance: AxiosInstance;

export function initialize(apiKey: string, mode: 'live' | 'sandbox') {
  const baseUrl = mode === 'live' ? 'https://carbonapisecure.getcarbon.co/baas/api' : 'https://carbonapistagingsecure.getcarbon.co/baas/api';
  const accessKey = 'baas-consumers';

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

export { createAccount, fetchAccount } from './accounts';
export { verifyTransaction, fetchTransactions } from './transactions';
export { createCustomer, fetchCustomer, fetchCustomers } from './customers';
export { initiatePayout, fetchPayout } from './payouts';
export { fetchBanks, resolveAccount } from './banks';
