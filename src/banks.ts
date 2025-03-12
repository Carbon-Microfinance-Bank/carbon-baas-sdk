import { getInstance } from './index';
import { handleError } from './util';

interface ResolveAccountRequest {
  account_number: string;
  bank_code: string;
}

interface UptimeResponse {
  status: string;
  message: string;
  data: Array<{
    cbnBankCode: string;
    nipBankCode: string;
    uptime: number;
  }>;
}

export async function fetchBanks() {
  try {
    const response = await getInstance().get('/v1/banks');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function resolveAccount(accountData: ResolveAccountRequest) {
  try {
    const response = await getInstance().post('/v1/banks/resolve', accountData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchBanksUptime() {
  try {
    const response = await getInstance().get('/v1/banks/uptime');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
