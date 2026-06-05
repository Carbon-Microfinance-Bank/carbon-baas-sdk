export declare function enrollCustomer(customer_id: string): Promise<any>;
export declare function verifyCustomerKyc(customerId: string): Promise<any>;
export declare function getCustomerKycStatus(customerId: string): Promise<any>;
interface ApplyForLoanRequest {
    customer_id: string;
    /** Loan amount in kobo */
    amount: number;
    /** Repayment period in months (1–6) */
    repayment_period: number;
    /** WORKING_CAPITAL | EXPANSION_AND_GROWTH | EQUIPMENT_PURCHASE | INVENTORY_MGT | DEBT_FINANCING | STARTUP_CAPITAL | OTHERS */
    loan_purpose: string;
    /** Merchant-supplied idempotency key */
    reference: string;
}
export declare function applyForLoan(data: ApplyForLoanRequest): Promise<any>;
interface ListLoanApplicationsParams {
    status?: string;
    customer_id?: string;
    page?: number;
    limit?: number;
}
export declare function listLoanApplications(params?: ListLoanApplicationsParams): Promise<any>;
export declare function getLoanApplication(applicationId: string): Promise<any>;
interface SubmitUnderwritingRequest {
    monthly_revenue: number;
    years_in_business: number;
    num_employees: number;
    business_sector: string;
}
export declare function submitUnderwriting(applicationId: string, data: SubmitUnderwritingRequest): Promise<any>;
interface RequestBankStatementRequest {
    account_number: string;
    /** Bank sort code — use listSupportedStatementBanks() to get valid values */
    sort_code: string;
    num_months?: number;
}
export declare function requestBankStatement(applicationId: string, data: RequestBankStatementRequest): Promise<any>;
export declare function getBankStatementStatus(applicationId: string): Promise<any>;
export declare function startDecisioning(applicationId: string): Promise<any>;
interface CalculateRepaymentRequest {
    loan_amount: number;
    tenure: number;
    state: string;
}
export declare function calculateRepayment(data: CalculateRepaymentRequest): Promise<any>;
export declare function getLoanOffer(applicationId: string): Promise<any>;
interface DisbursementAccountRequest {
    account_number: string;
    bank_code: string;
}
export declare function setDisbursementAccount(applicationId: string, data: DisbursementAccountRequest): Promise<any>;
export declare function acceptOffer(applicationId: string): Promise<any>;
interface DeclineOfferRequest {
    /** HIGH_INTEREST | OFFER_SMALL | REPAYMENT_PERIOD | CHECKING | OTHERS */
    decline_reason: string;
}
export declare function declineOffer(applicationId: string, data: DeclineOfferRequest): Promise<any>;
type FileTag = 'ADDITIONAL_DOCS' | 'BANK_STATEMENTS' | 'BUSINESS_REG_DOCS' | 'CAC_FORM7_DOCS' | 'FIN_ACCT_DOCS' | 'ID_CARD_DOCS' | 'PAYEE_PAYMENTS_DOCS' | 'PENSION_PAYMENTS_DOCS' | 'TAX_RETURNS_DOCS' | 'ADDRESS_VERIFICATION_DOC' | 'BOARD_RESOLUTION_DOC';
export declare function uploadLoanDocument(applicationId: string, file: File | Blob, file_tag: FileTag): Promise<any>;
export declare function agreeToTerms(applicationId: string): Promise<any>;
interface BoardResolutionRequest {
    /** file_url returned from uploadLoanDocument() with file_tag = BOARD_RESOLUTION_DOC */
    file_url: string;
}
export declare function uploadBoardResolution(applicationId: string, data: BoardResolutionRequest): Promise<any>;
interface CreateGuarantorRequest {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
}
export declare function createGuarantor(applicationId: string, data: CreateGuarantorRequest): Promise<any>;
export declare function getGuarantors(applicationId: string): Promise<any>;
export declare function postOfferKyc(applicationId: string): Promise<any>;
export declare function getActiveLoan(customer_id: string): Promise<any>;
export declare function getRepaymentSchedule(loanId: string): Promise<any>;
interface ChargeRepaymentRequest {
    /** Repayment amount in kobo */
    amount: number;
    reference: string;
}
export declare function chargeRepayment(loanId: string, data: ChargeRepaymentRequest): Promise<any>;
export declare function listSupportedStatementBanks(): Promise<any>;
export {};
