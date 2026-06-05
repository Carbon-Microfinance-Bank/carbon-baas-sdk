import { getInstance } from './index';
import { handleError } from './util';

// ── Customer enrollment ──────────────────────────────────────────────────────

export async function enrollCustomer(customer_id: string) {
  try {
    const response = await getInstance().post('/v1/loans/customers/enroll', { customer_id });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function verifyCustomerKyc(customerId: string) {
  try {
    const response = await getInstance().post(`/v1/loans/customers/${customerId}/verify-kyc`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getCustomerKycStatus(customerId: string) {
  try {
    const response = await getInstance().get(`/v1/loans/customers/${customerId}/kyc-status`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// ── Loan application ─────────────────────────────────────────────────────────

interface ApplyForLoanRequest {
  customer_id: string;
  /** Loan amount in kobo */
  amount: number;
  /** Repayment period in months (1–6) */
  repayment_period: number;
  loan_purpose: 'WORKING_CAPITAL' | 'EXPANSION_AND_GROWTH' | 'EQUIPMENT_PURCHASE' | 'INVENTORY_MGT' | 'DEBT_FINANCING' | 'STARTUP_CAPITAL' | 'OTHERS';
  /** Merchant-supplied idempotency key */
  reference: string;
}

export async function applyForLoan(data: ApplyForLoanRequest) {
  try {
    const response = await getInstance().post('/v1/loans/apply', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

interface ListLoanApplicationsParams {
  status?: string;
  customer_id?: string;
  page?: number;
  limit?: number;
}

export async function listLoanApplications(params?: ListLoanApplicationsParams) {
  try {
    const response = await getInstance().get('/v1/loans', { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getLoanApplication(applicationId: string) {
  try {
    const response = await getInstance().get(`/v1/loans/${applicationId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// ── Underwriting & decisioning ───────────────────────────────────────────────

interface SubmitUnderwritingRequest {
  structure: {
    hasWebsite: boolean;
    hasSocialMediaHandles: boolean;
    isRegisteredBusiness: boolean;
    hasAuditedFinancialStatement: boolean;
    payPension: boolean;
    hasPayeeReceipt: boolean;
    hasBusinessInsurance: boolean;
    hasTaxClearanceCert: boolean;
    hasCorporateBankAccount: boolean;
    hasManagementAccounts: boolean;
    hasAccountant: boolean;
    hasStaffHealthCare: boolean;
    ownProperty: boolean;
    payRent: boolean;
  };
  address: {
    street: string;
    city: string;
    lga: string;
    state: string;
    country: string;
    addressVerificationType: 'POWER_BILL' | 'INTERNET_BILL' | 'WATER_CORPORATION_BILL' | 'WASTE_MANAGEMENT_BILL' | 'STAMPED_RENT_RECEIPT';
  };
  profile: {
    yearsInBusiness: 'ONE' | 'TWO_TO_FIVE' | 'SIX_OR_MORE';
    numberOfLocations: 'ONE' | 'TWO_TO_FIVE' | 'SIX_OR_MORE';
    numberOfStaff: 'ONE_TO_FIVE' | 'SIX_TO_FIFTEEN' | 'SIXTEEN_OR_MORE';
    grossProfitMargin: number;
    operatingExpenses: number;
    businessRole: 'OWNER' | 'PARTNER';
    averageDailyCustomers: 'ONE_TO_FOUR' | 'FIVE_TO_FOURTEEN' | 'FIFTEEN_TO_TWENTYFOUR' | 'TWENTYFIVE_TO_FORTYNINE' | 'FIFTY_OR_MORE';
    businessStartDate: string;
    businessType: 'LIMITED_LIABILITY' | 'PARTNERSHIP' | 'SOLE_PROPRIETORSHIP' | 'NGO';
    businessWebsite?: string;
  };
  userIdentity: {
    idType: string;
    idNumber: string;
  };
}

export async function submitUnderwriting(applicationId: string, data: SubmitUnderwritingRequest) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/submit-underwriting`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

interface RequestBankStatementRequest {
  sort_code: string;
  account_number: string;
  phone: string;
}

export async function requestBankStatement(applicationId: string, data: RequestBankStatementRequest) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/bank-statement`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getBankStatementStatus(applicationId: string) {
  try {
    const response = await getInstance().get(`/v1/loans/${applicationId}/bank-statement/status`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function startDecisioning(applicationId: string) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/start-decisioning`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// ── Offer ────────────────────────────────────────────────────────────────────

interface CalculateRepaymentRequest {
  loan_amount: number;
  tenure: number;
  state: string;
}

export async function calculateRepayment(data: CalculateRepaymentRequest) {
  try {
    const response = await getInstance().post('/v1/loans/calculate-repayment', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getLoanOffer(applicationId: string) {
  try {
    const response = await getInstance().get(`/v1/loans/${applicationId}/offer`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

interface DisbursementAccountRequest {
  account_number: string;
  bank_code: string;
}

export async function setDisbursementAccount(applicationId: string, data: DisbursementAccountRequest) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/disbursement-account`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function acceptOffer(applicationId: string) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/offer/accept`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

interface DeclineOfferRequest {
  decline_reason: 'HIGH_INTEREST' | 'OFFER_SMALL' | 'REPAYMENT_PERIOD' | 'CHECKING' | 'OTHERS';
}

export async function declineOffer(applicationId: string, data: DeclineOfferRequest) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/offer/decline`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

type FileTag =
  | 'ADDITIONAL_DOCS'
  | 'BANK_STATEMENTS'
  | 'BUSINESS_REG_DOCS'
  | 'CAC_FORM7_DOCS'
  | 'FIN_ACCT_DOCS'
  | 'ID_CARD_DOCS'
  | 'PAYEE_PAYMENTS_DOCS'
  | 'PENSION_PAYMENTS_DOCS'
  | 'TAX_RETURNS_DOCS'
  | 'ADDRESS_VERIFICATION_DOC'
  | 'BOARD_RESOLUTION_DOC';

export async function uploadLoanDocument(applicationId: string, file: File | Blob, file_tag: FileTag) {
  try {
    const form = new FormData();
    form.append('file', file);
    form.append('file_tag', file_tag);
    const response = await getInstance().post(`/v1/loans/${applicationId}/documents`, form);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// ── Post-offer steps ─────────────────────────────────────────────────────────

export async function agreeToTerms(applicationId: string) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/terms/agree`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

interface BoardResolutionRequest {
  /** file_url returned from uploadLoanDocument() with file_tag = BOARD_RESOLUTION_DOC */
  file_url: string;
}

export async function uploadBoardResolution(applicationId: string, data: BoardResolutionRequest) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/board-resolution`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

interface CreateGuarantorRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

export async function createGuarantor(applicationId: string, data: CreateGuarantorRequest) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/guarantor`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getGuarantors(applicationId: string) {
  try {
    const response = await getInstance().get(`/v1/loans/${applicationId}/guarantor`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function postOfferKyc(applicationId: string) {
  try {
    const response = await getInstance().post(`/v1/loans/${applicationId}/post-offer-kyc`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// ── Repayment ────────────────────────────────────────────────────────────────

export async function getActiveLoan(customer_id: string) {
  try {
    const response = await getInstance().get('/v1/loans/active', { params: { customer_id } });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getRepaymentSchedule(loanId: string) {
  try {
    const response = await getInstance().get(`/v1/loans/${loanId}/repayments`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

interface ChargeRepaymentRequest {
  /** Repayment amount in kobo */
  amount: number;
  reference: string;
}

export async function chargeRepayment(loanId: string, data: ChargeRepaymentRequest) {
  try {
    const response = await getInstance().post(`/v1/loans/${loanId}/repayments`, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// ── Utilities ────────────────────────────────────────────────────────────────

export async function listSupportedStatementBanks() {
  try {
    const response = await getInstance().get('/v1/loans/banks/list');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}
