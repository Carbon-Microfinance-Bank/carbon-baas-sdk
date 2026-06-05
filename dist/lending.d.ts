export declare function enrollCustomer(customer_id: string): Promise<any>;
export declare function verifyCustomerKyc(customerId: string): Promise<any>;
export declare function getCustomerKycStatus(customerId: string): Promise<any>;
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
export declare function submitUnderwriting(applicationId: string, data: SubmitUnderwritingRequest): Promise<any>;
interface RequestBankStatementRequest {
    sort_code: string;
    account_number: string;
    phone: string;
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
    decline_reason: 'HIGH_INTEREST' | 'OFFER_SMALL' | 'REPAYMENT_PERIOD' | 'CHECKING' | 'OTHERS';
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
