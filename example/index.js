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


// Example: Lending flow — enroll → KYC → apply → offer → disburse → repay
async function exampleLendingFlow() {
  const CUSTOMER_ID = 'your_customer_uuid_here';

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

  // Step 5 — Submit underwriting data
  await carbon.submitUnderwriting(applicationId, {
    monthly_revenue: 5000000,
    years_in_business: 3,
    num_employees: 10,
    business_sector: 'RETAIL',
  });

  // Step 6 — Request bank statement
  const banks = await carbon.listSupportedStatementBanks();
  console.log('Supported banks:', banks.data);
  await carbon.requestBankStatement(applicationId, {
    account_number: '0123456789',
    sort_code: '058',
    num_months: 6,
  });

  // Step 7 — Start decisioning (poll getLoanApplication until status = HAS_OFFER)
  await carbon.startDecisioning(applicationId);

  // Step 8 — Fetch offer
  const offer = await carbon.getLoanOffer(applicationId);
  console.log('Offer:', offer.data);

  // Step 9 — Set disbursement account and accept offer
  await carbon.setDisbursementAccount(applicationId, {
    account_number: '0123456789',
    bank_code: '058',
  });
  await carbon.acceptOffer(applicationId);

  // Step 10 — Post-offer steps
  await carbon.agreeToTerms(applicationId);
  // For non-sole-prop businesses, upload board resolution first:
  // const doc = await carbon.uploadLoanDocument(applicationId, file, 'BOARD_RESOLUTION_DOC');
  // await carbon.uploadBoardResolution(applicationId, { file_url: doc.data.file_url });
  await carbon.postOfferKyc(applicationId);

  // Step 11 — After disbursement, get active loan and repayment schedule
  const activeLoan = await carbon.getActiveLoan(CUSTOMER_ID);
  const loanId = activeLoan.data.loanId;
  console.log('Active loan:', activeLoan.data);

  const schedule = await carbon.getRepaymentSchedule(loanId);
  console.log('Repayment schedule:', schedule.data);

  // Step 12 — Charge repayment
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

