interface CreateCustomerRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    street: string;
    city: string;
    state: string;
    country: string;
    bvn: string;
    nin: string;
}
export declare function createCustomer(customerData: CreateCustomerRequest): Promise<any>;
export declare function fetchCustomer(customerId: string): Promise<any>;
export declare function fetchCustomers(page?: number, limit?: number): Promise<any>;
export {};
