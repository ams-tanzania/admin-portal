import apiClient from "../baseUrl";
import { API_ENDPOINTS } from "../Endpoints";

export interface Shipment {
    id: string;
    customer_id: string;
    tracking_number: string;
    description: string;
    customer_name: string;
    shipment_image: string;
    customer_email: string;
    customer_phone: string;
    shipment_status: string;
    payment_status: string;
}

export interface Batch {
    id: string;
    batch_number: string;
    route: string;
    origin_branch: string;
    destination_branch: string;
    departure_date: string;
    estimated_arrival_date: string;
    actual_arrival_at: string | null;
    actual_departure_at: string | null;
    capacity_in_cbm: string;
    status: string;
    shipments?: Shipment[];  // optional since list view won't have it
}

export interface Branch {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
}

export interface CreateBranchPayload {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
}

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Get all branches
export const getAllBranches = async (): Promise<Branch[]> => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCHES, {
        headers: authHeader(),
    });
    return response.data.data;
};

// Get branch by ID
export const getBranchById = async (id: string): Promise<Branch> => {
    const response = await apiClient.get(`${API_ENDPOINTS.BRANCHES}/${id}`, {
        headers: authHeader(),
    });
    return response.data.data;
};

// Create branch
export const createBranch = async (
    payload: CreateBranchPayload
): Promise<{ success: boolean; data: Branch }> => {
    const response = await apiClient.post(API_ENDPOINTS.BRANCHES, payload, {
        headers: authHeader(),
    });
    return response.data;
};

// Update branch
export const updateBranch = async (
    id: string,
    payload: Partial<CreateBranchPayload>
): Promise<{ success: boolean; data: Branch }> => {
    const response = await apiClient.put(`${API_ENDPOINTS.BRANCHES}/${id}`, payload, {
        headers: authHeader(),
    });
    return response.data;
};

// Delete branch
export const deleteBranch = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.BRANCHES}/${id}`, {
        headers: authHeader(),
    });
    return response.data;
};