import apiClient from "../baseUrl";
import { API_ENDPOINTS } from "../Endpoints";

export interface Route {
    id: string;
    name: string;
    origin_branch: string;
    destination_branch: string;
    estimated_duration_hours: number;
}

export interface RouteDetail {
    name: string;
    origin_branch_id: string;
    destination_branch_id: string;
    estimated_duration_hours: number;
}

export interface CreateRoutePayload {
    name: string;
    origin_branch_id: string;
    destination_branch_id: string;
    estimated_duration_hours: number;
}

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Get all routes
export const getAllRoutes = async (): Promise<Route[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ROUTES, {
        headers: authHeader(),
    });
    return response.data.data;
};

// Get route by ID
export const getRouteById = async (id: string): Promise<RouteDetail> => {
    const response = await apiClient.get(`${API_ENDPOINTS.ROUTES}/${id}`, {
        headers: authHeader(),
    });
    return response.data.data;
};

// Create route
export const createRoute = async (
    payload: CreateRoutePayload
): Promise<{ success: boolean; data: Route }> => {
    const response = await apiClient.post(API_ENDPOINTS.ROUTES, payload, {
        headers: authHeader(),
    });
    return response.data;
};

// Update route
export const updateRoute = async (
    id: string,
    payload: Partial<CreateRoutePayload>
): Promise<{ success: boolean; data: Route }> => {
    const response = await apiClient.put(`${API_ENDPOINTS.ROUTES}/${id}`, payload, {
        headers: authHeader(),
    });
    return response.data;
};

// Delete route
export const deleteRoute = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.ROUTES}/${id}`, {
        headers: authHeader(),
    });
    return response.data;
};