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
```

### ES Modules

```javascript
import { initialize, createAccount, fetchAccount, fetchAccounts } from 'carbon-baas-sdk';

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

fetchCustomers(page?: number, limit?: number)
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
fetchWebhook()

updateWebhook(data: UpdateWebhookRequest)
// data: { url: string }

fetchWebhookHistory(page?: number, limit?: number)

resendWebhookEvent(eventId: string)
```

## Example Usage

### Managing Accounts
```javascript
import { createAccount, fetchAccount, fetchAccounts } from 'carbon-baas-sdk';

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