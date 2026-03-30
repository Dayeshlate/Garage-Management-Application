import { apiClient } from './config';

export interface UserDTO {
  id: number;
  name: string;
  password?: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'MECHANIC';
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

export interface RegisterResponse {
  message: string;
  userId: number;
}

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> => apiClient.post('/api/auth/login', data),
  signup: (data: SignupRequest): Promise<RegisterResponse> => apiClient.post('/api/auth/register', data),
};
