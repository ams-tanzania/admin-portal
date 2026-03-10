import apiClient from "../baseUrl";
import { API_ENDPOINTS } from "../Endpoints";


export interface LoginPayload {
    email: string;
    password: string;
    platform: "web";
}

export interface LoginResponse {
    status: string;
    success: boolean;
    message?: string;
    staff_id: string;
    first_name: string;
    last_name: string;
    position: string;
    branch: string;
    token: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const payload: LoginPayload = { email, password, platform: "web" };
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, payload);
    return response.data;
};