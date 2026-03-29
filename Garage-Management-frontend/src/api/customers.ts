import { apiClient } from './config';
import { UserDTO } from './auth';

// Customers are Users in the backend
export type Customer = UserDTO;
export type CreateCustomerDto = Omit<UserDTO, 'id' | 'vehicle_ids'>;

export const customersApi = {
  getAll: (): Promise<Customer[]> => apiClient.get('/users'),
  getById: (id: number): Promise<Customer> => apiClient.get(`/users/${id}`),
  create: (data: CreateCustomerDto): Promise<Customer> => apiClient.post('/users', data),
  update: (id: number, data: Partial<Customer>): Promise<Customer> => apiClient.put(`/users/${id}`, data),
  delete: (id: number): Promise<void> => apiClient.delete(`/users/${id}`),
};
