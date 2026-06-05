# Carbon Business API SDK

This SDK provides a simple interface to interact with the Carbon Business API, allowing developers to integrate Carbon's financial services into their applications.

## API Documentation
[![Postman](https://img.shields.io/badge/Postman-E97627?style=for-the-badge&logo=Postman&logoColor=white)](https://documenter.getpostman.com/view/33237778/2sA2rFRzKS#37cff604-7f17-448f-afe4-2a456f8ad23a)

## Installation

```bash
npm install carbon-baas-sdk
```

## Configuration

Initialize the SDK with your API key and mode (live or sandbox):

### CommonJS

```javascript
const carbon = require('carbon-baas-sdk');

carbon.initialize('your_api_key_here', 'sandbox');

// Create an account for a third-party customer
carbon.createAccount({
  account_type: 'static',
  third_party: true,
  customer_id: 'customer_123'
})
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Fetch an account
carbon.fetchAccount('account_number')
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Fetch all accounts with pagination
carbon.fetchAccounts(1, 10) // page 1, limit 10
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Fetch account balance
carbon.fetchAccountBalance('account_number')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### ES Modules

```javascript
import { initialize, createAccount, fetchAccount, fetchAccounts, fetchAccountBalance } from 'carbon-baas-sdk';

initialize('your_api_key_here', 'sandbox');

// Create an account for a third-party customer
const account = await createAccount({
  account_type: 'static',
  third_party: true,
  customer_id: 'customer_123'
});
console.log(account);

// Fetch an account
const accountDetails = await fetchAccount('account_number');
console.log(accountDetails);

// Fetch accounts
const accounts = await fetchAccounts(1, 10); // page 1, limit 10
console.log(accounts);

// Fetch account balance
const balance = await fetchAccountBalance('account_number');
console.log(balance);
```

```javascript
import { initialize } from 'carbon-baas-sdk';

initialize('your_api_key_here', 'sandbox');
```

## API Reference

### Authentication
```javascript
initialize(apiKey: string, mode: 'live' | 'sandbox')
```

### Accounts
```javascript
createAccount(accountData: CreateAccountRequest)
// accountData: { 
//   account_type: "static",      // Must always be "static"
//   third_party?: boolean,       // true for third-party customer, false for own business sub-account (defaults to true)
//   customer_id?: string,        // Required if third_party is true
//   account_name?: string        // Required if third_party is false
// }

fetchAccount(accountNumber: string)

fetchAccounts(page?: number, limit?: number)

fetchAccountBalance(accountNumber: string)
```

### Customers
```javascript
createCustomer(customerData: CreateCustomerRequest)
// customerData: {
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   dob: string;
//   gender: string;
//   street: string;
//   city: string;
//   state: string;
//   country: string;
//   bvn: string;
//   nin: string;
// }

fetchCustomer(customerId: string)

fetchCustomers(params?: FetchCustomersParams)
// params: {
//   page?: number;    // Page number for pagination
//   limit?: number;   // Number of customers per page
//   gender?: string;  // Filter by gender (e.g. 'MALE', 'FEMALE')
//   email?: string;   // Filter by customer email address
//   bvn?: string;     // Filter by Bank Verification Number
//   phone?: string;   // Filter by phone number
// }
```

### Transactions
```javascript
verifyTransaction(accountNumber: string, reference: string)

fetchTransactions(accountNumber: string, page?: number, limit?: number)
```

### Payouts
```javascript
initiatePayout(payoutData: InitiatePayoutRequest)
// payoutData: {
//   amount: number;
//   source: { account_number: string };
//   beneficiary: {
//     bank_code: string;
//     bank_name: string;
//     account_number: string;
//     account_name: string;
//   };
//   reference: string;
//   meta_data: object;
//   remark: string;
// }

fetchPayout(payoutId: string)

fetchPayoutsWithPendingApprovals(includeExpired?: boolean)

approveOrDeclinePayout(data: PayoutApprovalRequest)
// data: {
//   authCode: string;              // Authorization code for the payout
//   action: 'approve' | 'decline'; // Action to take
//   reason?: string;               // Required if action is 'decline'
// }

merchantFeeCharge(data: MerchantFeeChargeRequest)
// data: {
//   amount: number;          // Amount in Naira. Must be a positive value.
//   sourceAccountId: string; // Source account number to be debited.
//   targetAccountId: string; // Target account number to be credited.
//   description?: string;    // Optional narration/description for the fee charge.
// }
```

### Banks
```javascript
fetchBanks()

resolveAccount(accountData: ResolveAccountRequest)
// accountData: { account_number: string, bank_code: string }

fetchBanksUptime()
```

### Webhooks
```javascript

fetchWebhookHistory(page?: number, limit?: number)

resendWebhookEvent(eventId: string)
```

### Lending

Enables fintech partners to originate business loans for their end-customers.
All monetary values are in **kobo** (divide by 100 to get Naira).

> Requires `LENDING_FEATURE_ENABLED=true` on the server.

#### Customer enrollment
```javascript
enrollCustomer(customer_id: string)

verifyCustomerKyc(customerId: string)

getCustomerKycStatus(customerId: string)
```

#### Loan application
```javascript
applyForLoan(data: ApplyForLoanRequest)
// data: {
//   customer_id: string;
//   amount: number;           // kobo
//   repayment_period: number; // months (1–6)
//   loan_purpose: string;     // WORKING_CAPITAL | EXPANSION_AND_GROWTH | EQUIPMENT_PURCHASE
//                             // INVENTORY_MGT | DEBT_FINANCING | STARTUP_CAPITAL | OTHERS
//   reference: string;        // merchant idempotency key
// }

listLoanApplications(params?: { status?: string; customer_id?: string; page?: number; limit?: number })

getLoanApplication(applicationId: string)
```

#### Underwriting & decisioning
```javascript
submitUnderwriting(applicationId: string, data: {
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
    businessRole: string;
    averageDailyCustomers: 'ONE_TO_FOUR' | 'FIVE_TO_FOURTEEN' | 'FIFTEEN_TO_TWENTYFOUR' | 'TWENTYFIVE_TO_FORTYNINE' | 'FIFTY_OR_MORE';
    businessStartDate: string;   // ISO date: YYYY-MM-DD
    businessType: string;
    businessWebsite?: string;
  };
  userIdentity: {
    idType: string;              // e.g. 'NIN', 'BVN'
    idNumber: string;
  };
})

requestBankStatement(applicationId: string, data: {
  sort_code: string;       // use listSupportedStatementBanks() to get valid values
  account_number: string;
  phone: string;
  num_months?: number;
})

getBankStatementStatus(applicationId: string)

uploadLoanDocument(applicationId: string, file: File | Blob, file_tag: FileTag)
// file_tag: ADDITIONAL_DOCS | BANK_STATEMENTS | BUSINESS_REG_DOCS | CAC_FORM7_DOCS |
//           FIN_ACCT_DOCS | ID_CARD_DOCS | PAYEE_PAYMENTS_DOCS | PENSION_PAYMENTS_DOCS |
//           TAX_RETURNS_DOCS | ADDRESS_VERIFICATION_DOC | BOARD_RESOLUTION_DOC

startDecisioning(applicationId: string)
```

#### Offer
```javascript
calculateRepayment(data: { loan_amount: number; tenure: number; state: string })

getLoanOffer(applicationId: string)

setDisbursementAccount(applicationId: string, data: { account_number: string; bank_code: string })

acceptOffer(applicationId: string)

declineOffer(applicationId: string, data: { decline_reason: string })
// decline_reason: HIGH_INTEREST | OFFER_SMALL | REPAYMENT_PERIOD | CHECKING | OTHERS
```

#### Post-offer steps
```javascript
agreeToTerms(applicationId: string)

uploadBoardResolution(applicationId: string, data: { file_url: string })
// file_url comes from uploadLoanDocument() with file_tag = BOARD_RESOLUTION_DOC

createGuarantor(applicationId: string, data: {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
})

getGuarantors(applicationId: string)

postOfferKyc(applicationId: string)
```

#### Repayment
```javascript
getActiveLoan(customer_id: string)

getRepaymentSchedule(loanId: string)  // loanId from getActiveLoan()

chargeRepayment(loanId: string, data: { amount: number; reference: string })

```

## Example Usage

### Managing Accounts
```javascript
import { createAccount, fetchAccount, fetchAccounts, fetchAccountBalance } from 'carbon-baas-sdk';

// Create an account for a third-party customer
const newCustomerAccount = await createAccount({
  account_type: 'static',
  third_party: true,
  customer_id: 'customer_123'
});

// Create a sub-account for your own business (for collections)
const newSubAccount = await createAccount({
  account_type: 'static',
  third_party: false,
  account_name: 'Collections'
});

// Fetch account details
const accountDetails = await fetchAccount('1234567890');

// Fetch account balance
const balance = await fetchAccountBalance('1234567890');

// Fetch all accounts (with pagination)
const accounts = await fetchAccounts(1, 20); // page 1, 20 items per page
```

### Managing Customers
```javascript
import { createCustomer, fetchCustomer } from 'carbon-baas-sdk';

// Create a customer
const customerData = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '2348012345678',
  dob: '1990-01-01',
  gender: 'male',
  street: '123 Main St',
  city: 'Lagos',
  state: 'Lagos',
  country: 'Nigeria',
  bvn: '12345678901',
  nin: '12345678901'
};

const newCustomer = await createCustomer(customerData);

// Fetch customer details
const customerDetails = await fetchCustomer('customer_id');

// Fetch all customers (with pagination and filters)
const customers = await fetchCustomers({ page: 1, limit: 10 });

// Filter by BVN
const byBvn = await fetchCustomers({ bvn: '11111011116' });

// Filter by email
const byEmail = await fetchCustomers({ email: 'john.doe@example.com' });
```

### Managing Payouts
```javascript
import { initiatePayout, fetchPayout, fetchPayoutsWithPendingApprovals, approveOrDeclinePayout, merchantFeeCharge } from 'carbon-baas-sdk';

// Initiate a payout
const payoutData = {
  amount: 1000,
  source: { account_number: '1234567890' },
  beneficiary: {
    bank_code: '058',
    bank_name: 'GTB',
    account_number: '0987654321',
    account_name: 'John Doe'
  },
  reference: 'payout_ref_123',
  meta_data: { description: 'Payment for services' },
  remark: 'Service payment'
};

const payout = await initiatePayout(payoutData);

// Fetch payout details
const payoutDetails = await fetchPayout('payout_id');

// Fetch payouts with pending approvals
const pendingPayouts = await fetchPayoutsWithPendingApprovals();

// Fetch payouts with pending approvals including expired ones
const allPendingPayouts = await fetchPayoutsWithPendingApprovals(true);

// Approve a payout
const approved = await approveOrDeclinePayout({
  authCode: 'TRF-1771341301552SNKED',
  action: 'approve'
});

// Decline a payout
const declined = await approveOrDeclinePayout({
  authCode: 'TRF-1771341301552SNKED',
  action: 'decline',
  reason: 'Insufficient documentation'
});

// Process a merchant fee charge
const feeCharge = await merchantFeeCharge({
  amount: 10,
  sourceAccountId: '0340899287',
  targetAccountId: '6009490194',
  description: 'Fee Charge of N100'
});
```

### Managing Webhooks
```javascript
import { resendWebhookEvent, fetchWebhookHistory } from 'carbon-baas-sdk';

// Resend webhook event
const webhook = await resendWebhookEvent(eventId);

// Fetch webhook history
const history = await fetchWebhookHistory(1, 10);
```

### Bank Operations
```javascript
import { fetchBanks, resolveAccount, fetchBanksUptime } from 'carbon-baas-sdk';

// Fetch all banks
const banks = await fetchBanks();

// Resolve account
const accountDetails = await resolveAccount({
  account_number: '1234567890',
  bank_code: '058'
});

// Check banks uptime
const uptime = await fetchBanksUptime();
```

### Lending Flow
```javascript
import {
  createAccount,
  enrollCustomer, verifyCustomerKyc, getCustomerKycStatus,
  applyForLoan, submitUnderwriting,
  listSupportedStatementBanks, requestBankStatement, getBankStatementStatus,
  uploadLoanDocument, startDecisioning, getLoanOffer,
  setDisbursementAccount, acceptOffer, agreeToTerms,
  uploadBoardResolution, createGuarantor, postOfferKyc,
  getActiveLoan, getRepaymentSchedule, chargeRepayment,
} from 'carbon-baas-sdk';

// 1. Enroll customer for lending
await enrollCustomer('customer_uuid');

// 2. Trigger KYC verification
await verifyCustomerKyc('customer_uuid');

// 3. Poll until VERIFIED
const { data: { kyc_status } } = await getCustomerKycStatus('customer_uuid');

// 4. Apply for loan
const { data: { application_id } } = await applyForLoan({
  customer_id: 'customer_uuid',
  amount: 2000000,          // ₦20,000 in kobo
  repayment_period: 3,
  loan_purpose: 'INVENTORY_MGT',
  reference: 'MY_REF_001',
});

// 5. Create a Carbon account for the customer (used as statement source)
const { data: { account_number: carbon_account } } = await createAccount({
  account_type: 'static',
  third_party: true,
  customer_id: 'customer_uuid',
});

// 6. Submit bank statements
//    a. Carbon account statement (no sort_code needed — use Carbon's own sort code)
const supportedBanks = await listSupportedStatementBanks();
await requestBankStatement(application_id, {
  sort_code: '565',        // Carbon MFB sort code
  account_number: carbon_account,
  phone: '08098765436',
});

//    b. Any other bank account the customer holds
await requestBankStatement(application_id, {
  sort_code: '058',        // use listSupportedStatementBanks() for valid sort codes
  account_number: '0123456789',
  phone: '08098765436',
});

// Poll until statement is ready before proceeding
const { data: statementStatus } = await getBankStatementStatus(application_id);
console.log('Statement status:', statementStatus);

// 7. Upload required documents
await uploadLoanDocument(application_id, cacFile, 'BUSINESS_REG_DOCS');
await uploadLoanDocument(application_id, idFile, 'ID_CARD_DOCS');
await uploadLoanDocument(application_id, bankStatementFile, 'BANK_STATEMENTS');
// Add other docs as applicable: FIN_ACCT_DOCS, TAX_RETURNS_DOCS, ADDRESS_VERIFICATION_DOC, etc.

// 8. Submit business profile
await submitUnderwriting(application_id, {
  structure: {
    hasWebsite: true,
    hasSocialMediaHandles: true,
    isRegisteredBusiness: true,
    hasAuditedFinancialStatement: false,
    payPension: false,
    hasPayeeReceipt: true,
    hasBusinessInsurance: false,
    hasTaxClearanceCert: false,
    hasCorporateBankAccount: false,
    hasManagementAccounts: false,
    hasAccountant: true,
    hasStaffHealthCare: false,
    ownProperty: false,
    payRent: true,
  },
  address: {
    street: '12 Broad Street',
    city: 'Lagos Island',
    lga: 'Lagos Island',
    state: 'LAGOS',
    country: 'Nigeria',
    addressVerificationType: 'POWER_BILL',
  },
  profile: {
    yearsInBusiness: 'TWO_TO_FIVE',
    numberOfLocations: 'ONE',
    numberOfStaff: 'SIX_TO_FIFTEEN',
    grossProfitMargin: 35,
    operatingExpenses: 150000,
    businessRole: 'OWNER',
    averageDailyCustomers: 'FIFTEEN_TO_TWENTYFOUR',
    businessStartDate: '2022-01-15',
    businessType: 'SOLE_PROPRIETORSHIP',
  },
  userIdentity: {
    idType: 'NIN',
    idNumber: '12312312322',
  },
});

// 9. Start decisioning then poll until response (optional) it's automated
await startDecisioning(application_id);

// 10. Fetch offer
const { data: offer } = await getLoanOffer(application_id);

// 11. Set disbursement account (optional, it will default to carbon account associated with customer) and accept
await setDisbursementAccount(application_id, { account_number: carbon_account, bank_code: '565' });
await acceptOffer(application_id);

// 12. Post-offer steps
await agreeToTerms(application_id);

// For non-sole-proprietorship businesses, upload board resolution
if (businessType !== 'SOLE_PROPRIETORSHIP') {
  const doc = await uploadLoanDocument(application_id, boardResolutionFile, 'BOARD_RESOLUTION_DOC');
  await uploadBoardResolution(application_id, { file_url: doc.data.file_url });
}

// Invite guarantor(s)
await createGuarantor(application_id, {
  first_name: 'Jane',
  last_name: 'Doe',
  phone: '08012345678',
  email: 'jane.doe@example.com',
});

await postOfferKyc(application_id);

// 13. After disbursement — charge repayment
const { data: { loanId } } = await getActiveLoan('customer_uuid');
const schedule = await getRepaymentSchedule(loanId);
await chargeRepayment(loanId, { amount: 719999, reference: 'REPAY_001' });
```

## Error Handling

The SDK uses a consistent error handling pattern. All API calls return a response object that includes status and error information when applicable:

```javascript
try {
  const result = await createCustomer(customerData);
  if (result.status === 'failed') {
    console.error('API Error:', result.message, result.errors);
  } else {
    console.log('Success:', result.data);
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

## License

This project is licensed under the MIT License.