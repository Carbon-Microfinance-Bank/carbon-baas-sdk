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

// Create an account
carbon.createAccount('customer_id', 'static')
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Fetch an account
carbon.fetchAccount('account_number')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### ES Modules

```javascript
import { initialize, createAccount, fetchAccount } from 'carbon-baas-sdk';

initialize('your_api_key_here', 'sandbox');

// Create an account
const account = await createAccount('customer_id', 'static');
console.log(account);

// Fetch an account
const accountDetails = await fetchAccount('account_number');
console.log(accountDetails);
```

## API

### initialize(apiKey, mode)
- `apiKey`: Your Carbon API key.
- `mode`: The mode of the API ('live' or 'sandbox').

### createAccount(customerId, accountType)
- `customerId`: The ID of the customer.
- `accountType`: The type of account to create (e.g., 'static').

### fetchAccount(accountNumber)
- `accountNumber`: The account number to fetch details for.

### verifyTransaction(accountNumber, reference)
- `accountNumber`: The account number.
- `reference`: The transaction reference.

### fetchTransactions(accountNumber, page, limit)
- `accountNumber`: The account number.
- `page`: The page number for paginated results.
- `limit`: The number of transactions to be returned per page.

### createCustomer(customerData)
- `customerData`: The data of the customer to create.

### fetchCustomer(customerId)
- `customerId`: The ID of the customer to fetch.

### fetchCustomers(page, limit)
- `page`: The page number for paginated results.
- `limit`: The number of customers to be returned per page.

### initiatePayout(payoutData)
- `payoutData`: The data of the payout to initiate.

### fetchPayout(payoutId)
- `payoutId`: The ID of the payout to fetch.

### fetchBanks()
- Fetches the list of banks.

### resolveAccount(accountNumber, bankCode)
- `accountNumber`: The account number to resolve.
- `bankCode`: The bank code.

## License

This project is licensed under the MIT License.