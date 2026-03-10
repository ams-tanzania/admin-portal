import apiClient from "../baseUrl";
import { API_ENDPOINTS } from "../Endpoints";

export interface Customer {
    id: string;
    email: string;
    phone: string;
    full_name: string;
    company_name: string;
    address: string;
    city: string;
    country: string;
    status: string;
}

export interface CreateCustomerPayload {
    email: string;
    password: string;
    phone: string;
    staff_id: string;
    platform: "web";
    full_name: string;
    company_name: string;
    address: string;
    city: string;
    country: string;
}

// Get all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
    const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data.data.customers;
};

// Get customer by ID
export const getCustomerById = async (id: string): Promise<Customer> => {
    const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data.data.customer;
};

// Create customer
export const createCustomer = async (payload: CreateCustomerPayload): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.CUSTOMERS, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
};

// Update customer
export const updateCustomer = async (id: string, payload: Partial<CreateCustomerPayload>): Promise<{ status: string; message: string }> => {
    const response = await apiClient.put(`${API_ENDPOINTS.CUSTOMERS}/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
};

// Delete customer
export const deleteCustomer = async (id: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
};