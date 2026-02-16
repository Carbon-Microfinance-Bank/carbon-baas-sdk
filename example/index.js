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


async function run() {
  //await exampleCreateCustomer();
  //await exampleFetchCustomers();
  await exampleInitiatePayout();
}

run();

