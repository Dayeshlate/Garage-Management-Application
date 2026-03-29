import { apiClient } from './config';

export interface UserDTO {
  id: number;
  name: string;
  password?: string;
  email: string;
  role: 'ADMIN' | 'USER';
  phone: string;
  vehicle_ids: number[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> => apiClient.post('/auth/login', data),
  signup: (data: SignupRequest): Promise<AuthResponse> => apiClient.post('/auth/signup', data),
};
