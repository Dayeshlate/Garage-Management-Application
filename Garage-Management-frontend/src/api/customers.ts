import { apiClient } from './config';
import { UserDTO } from './auth';
import { ApiError } from './config';

// Customers are Users in the backend
export type Customer = UserDTO;
export type CreateCustomerDto = Omit<UserDTO, 'id' | 'vehicle_ids'>;

const unsupported = (message: string) => Promise.reject(new ApiError(405, message));

export const customersApi = {
  getAll: (): Promise<Customer[]> => apiClient.get('/user/getAllCustomer'),
  getById: async (id: number): Promise<Customer> => {
    const users = await apiClient.get('/user/getAllCustomer');
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new ApiError(404, 'Customer not found');
    }
    return user;
  },
  create: (data: CreateCustomerDto): Promise<{ message: string; userId: number }> => apiClient.post('/api/auth/register', data),
  update: (id: number, data: Partial<Customer>): Promise<{ message: string; user: Customer }> => apiClient.put(`/user/update/${id}`, data),
  delete: (): Promise<void> => unsupported('Delete customer endpoint is not available in backend yet'),
};
