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
    nin?: string;
}
export declare function createCustomer(customerData: CreateCustomerRequest): Promise<any>;
export declare function fetchCustomer(customerId: string): Promise<any>;
interface FetchCustomersParams {
    page?: number;
    limit?: number;
    gender?: string;
    email?: string;
    bvn?: string;
    phone?: string;
}
export declare function fetchCustomers(params?: FetchCustomersParams): Promise<any>;
export {};
