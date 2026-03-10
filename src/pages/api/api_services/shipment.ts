import apiClient from "../baseUrl";
import { API_ENDPOINTS } from "../Endpoints";

export interface Shipment {
    id: string;
    customer_id: string;
    tracking_number: string;
    description: string;
    batch_number: string;
    departure_date: string;
    estimated_arrival_date: string;
    origin: string;
    destination: string;
    customer_name: string;
    shipment_image: string | null;
    customer_email: string;
    customer_phone: string;
    shipment_status: string;
    payment_status: string;
}

export interface CreateShipmentPayload {
    customer_id: string;
    batch_id: string;
    description: string;
    platform: string;
    estimated_cbm: number;
    image?: File;
    staff_id: string;
}

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Get all shipments
export const getAllShipments = async (): Promise<Shipment[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS, {
        headers: authHeader(),
    });
    return response.data.data;
};

// Get shipment by ID
export const getShipmentById = async (id: string): Promise<Shipment> => {
    const response = await apiClient.get(`${API_ENDPOINTS.SHIPMENTS}/${id}`, {
        headers: authHeader(),
    });
    return response.data.data;
};

// Get shipments by customer ID
export const getShipmentsByCustomer = async (customerId: string): Promise<Shipment[]> => {
    const response = await apiClient.get(
        `${API_ENDPOINTS.SHIPMENTS}/customer/${customerId}`,
        { headers: authHeader() }
    );
    return response.data.data;
};

// Create shipment (multipart/form-data because of image)
export const createShipment = async (
    payload: CreateShipmentPayload
): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    formData.append("customer_id", payload.customer_id);
    formData.append("batch_id", payload.batch_id);
    formData.append("description", payload.description);
    formData.append("platform", payload.platform || "web");
    formData.append("estimated_cbm", payload.estimated_cbm.toString());
    formData.append("staff_id", payload.staff_id);
    if (payload.image) {
        formData.append("image", payload.image);
    }

    const response = await apiClient.post(API_ENDPOINTS.SHIPMENTS, formData, {
        headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.data;
};

// Delete shipment
export const deleteShipment = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.SHIPMENTS}/${id}`, {
        headers: authHeader(),
    });
    return response.data;
};