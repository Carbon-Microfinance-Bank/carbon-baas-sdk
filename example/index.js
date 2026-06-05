// Import the SDK
const carbon = require('../dist/index.umd.js');
const dotenv = require('dotenv');
dotenv.config();

// Initialize the SDK
console.log('Initializing Carbon SDK...');
carbon.initialize(process.env.CARBON_API_KEY, process.env.ENV);


// Example function to create a customer
async function exampleCreateCustomer() {
  const customerData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    dob: '1990-01-01',
    gender: 'male',
    street: '123 Main St',
    city: 'Ikeja',
    state: 'Lagos State',
    country: 'NG',
    bvn: '1234567890',
    nin: '12345678901', //optional
  };

  try {
    const newCustomer = await carbon.createCustomer(customerData);
    console.log('Customer created:', newCustomer);
    return newCustomer;
  } catch (error) {
    console.error('Error creating customer:', error);
  }
}

// Example function to fetch a customer
async function exampleFetchCustomers() {
  try {
    const customers = await carbon.fetchCustomers();
    console.log('Customers:', customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
}

async function exampleInitiatePayout() {
  try {
    const payoutData = {
      amount: 1000,
      source: {
        account_number: '1234567890', //api account number or dashboard account number
      },
      beneficiary: {
        bank_code: '044',
        bank_name: 'Access Bank',
        account_number: '1234567890',
        account_name: 'John Doe',
      },
      reference: 'PAYOUT12345',
      meta_data: {
        purpose: 'Service Payment'
      },
      remark: 'Payout for services rendered',
    };
    const payoutResponse = await carbon.initiatePayout(payoutData);
    console.log('Payout initiated:', payoutResponse);
  } catch (error) {
    console.error('Error initiating payout:', error);
  }
}


// Example: Lending flow — enroll → KYC → apply → statements → underwriting → offer → disburse → repay
async function exampleLendingFlow() {
  const CUSTOMER_ID = 'your_customer_uuid_here';
  const CUSTOMER_PHONE = '09030384055';

  // Step 1 — Enroll customer
  const enrolled = await carbon.enrollCustomer(CUSTOMER_ID);
  console.log('Enrolled:', enrolled);

  // Step 2 — Trigger KYC
  await carbon.verifyCustomerKyc(CUSTOMER_ID);

  // Step 3 — Poll KYC status until VERIFIED
  const kycStatus = await carbon.getCustomerKycStatus(CUSTOMER_ID);
  console.log('KYC status:', kycStatus.data.kyc_status);

  // Step 4 — Apply for loan
  const application = await carbon.applyForLoan({
    customer_id: CUSTOMER_ID,
    amount: 2000000,         // ₦20,000 in kobo
    repayment_period: 3,
    loan_purpose: 'INVENTORY_MGT',
    reference: `REF_${Date.now()}`,
  });
  const applicationId = application.data.application_id;
  console.log('Application ID:', applicationId);

  // Step 5 — Create a Carbon account for the customer (used as statement source)
  const carbonAccount = await carbon.createAccount({
    account_type: 'static',
    third_party: true,
    customer_id: CUSTOMER_ID,
  });
  const carbonAccountNumber = carbonAccount.data.account_number;

  // Step 6 — Submit bank statements
  const banks = await carbon.listSupportedStatementBanks();
  console.log('Supported banks:', banks.data);

  // Carbon account statement
  await carbon.requestBankStatement(applicationId, {
    sort_code: '565',        // Carbon MFB sort code
    account_number: carbonAccountNumber,
    phone: CUSTOMER_PHONE,
  });

  // Any other bank account the customer holds
  await carbon.requestBankStatement(applicationId, {
    sort_code: '058',
    account_number: '0123456789',
    phone: CUSTOMER_PHONE,
  });

  // Poll until statement is ready
  const statementStatus = await carbon.getBankStatementStatus(applicationId);
  console.log('Statement status:', statementStatus.data);

  // Step 7 — Upload required documents
  // await carbon.uploadLoanDocument(applicationId, cacFile, 'BUSINESS_REG_DOCS');
  // await carbon.uploadLoanDocument(applicationId, idFile, 'ID_CARD_DOCS');
  // await carbon.uploadLoanDocument(applicationId, bankStatementFile, 'BANK_STATEMENTS');

  // Step 8 — Submit business profile (underwriting)
  await carbon.submitUnderwriting(applicationId, {
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

  // Step 9 — Start decisioning (poll getLoanApplication until status = HAS_OFFER)
  await carbon.startDecisioning(applicationId);

  // Step 10 — Fetch offer
  const offer = await carbon.getLoanOffer(applicationId);
  console.log('Offer:', offer.data);

  // Step 11 — Set disbursement account and accept offer
  await carbon.setDisbursementAccount(applicationId, {
    account_number: '0123456789',
    bank_code: '058',
  });
  await carbon.acceptOffer(applicationId);

  // Step 12 — Post-offer steps
  await carbon.agreeToTerms(applicationId);

  // For non-sole-proprietorship businesses, upload board resolution
  const businessType = 'SOLE_PROPRIETORSHIP'; // replace with actual value from application
  if (businessType !== 'SOLE_PROPRIETORSHIP') {
    const doc = await carbon.uploadLoanDocument(applicationId, boardResolutionFile, 'BOARD_RESOLUTION_DOC');
    await carbon.uploadBoardResolution(applicationId, { file_url: doc.data.file_url });
  }

  // Invite guarantor(s)
  await carbon.createGuarantor(applicationId, {
    first_name: 'Jane',
    last_name: 'Doe',
    phone: '08012345678',
    email: 'jane.doe@example.com',
  });

  await carbon.postOfferKyc(applicationId);

  // Step 13 — After disbursement, get active loan and repayment schedule
  const activeLoan = await carbon.getActiveLoan(CUSTOMER_ID);
  const loanId = activeLoan.data.loanId;
  console.log('Active loan:', activeLoan.data);

  const schedule = await carbon.getRepaymentSchedule(loanId);
  console.log('Repayment schedule:', schedule.data);

  // Step 14 — Charge repayment
  const repayment = await carbon.chargeRepayment(loanId, {
    amount: 719999,
    reference: `REPAY_${Date.now()}`,
  });
  console.log('Repayment:', repayment);
}

async function run() {
  //await exampleCreateCustomer();
  //await exampleFetchCustomers();
  //await exampleInitiatePayout();
  //await exampleLendingFlow();
}

run();

