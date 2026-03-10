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
    shipments?: Shipment[];  // ← add this
}

export interface ActiveBatch {
    route_id: string;
    origin_branch_id: string;
    destination_branch_id: string;
    departure_date: string;
    estimated_arrival_date: string;
    capacity_in_cbm: number;
    staff_id: string;
}

export interface CreateBatchPayload {
    route_id: string;
    departure_date: string;
    estimated_arrival_date: string;
    capacity_in_cbm: number;
    staff_id: string;
}

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Get all batches
export const getAllBatches = async (): Promise<Batch[]> => {
    const response = await apiClient.get(API_ENDPOINTS.BATCHES, {
        headers: authHeader(),
    });
    return response.data.data;
};

// Get active batch
export const getActiveBatch = async (): Promise<ActiveBatch> => {
    const response = await apiClient.get(`${API_ENDPOINTS.BATCHES}/active`, {
        headers: authHeader(),
    });
    return response.data.data;
};

// Get batch by ID
export const getBatchById = async (id: string): Promise<Batch> => {
    const response = await apiClient.get(`${API_ENDPOINTS.BATCHES}/${id}`, {
        headers: authHeader(),
    });
    return response.data.data;
};

// Create batch
export const createBatch = async (
    payload: CreateBatchPayload
): Promise<{ success: boolean; data: Batch }> => {
    const response = await apiClient.post(API_ENDPOINTS.BATCHES, payload, {
        headers: authHeader(),
    });
    return response.data;
};

// Update batch
export const updateBatch = async (
    id: string,
    payload: Partial<CreateBatchPayload>
): Promise<{ success: boolean; data: Batch }> => {
    const response = await apiClient.put(`${API_ENDPOINTS.BATCHES}/${id}`, payload, {
        headers: authHeader(),
    });
    return response.data;
};

// Delete batch
export const deleteBatch = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.BATCHES}/${id}`, {
        headers: authHeader(),
    });
    return response.data;
};