import { apiClient } from './config';

export interface InventaryDTO {
  id: number;
  partName: string;
  partStock: number;
  partPrice: number;
  manufacture: string;
  jobCardIds: number[];
}

export type CreateInventaryDto = Omit<InventaryDTO, 'id'>;

export const inventoryApi = {
  getAll: (): Promise<InventaryDTO[]> => apiClient.get('/inventory'),
  getById: (id: number): Promise<InventaryDTO> => apiClient.get(`/inventory/${id}`),
  create: (data: CreateInventaryDto): Promise<InventaryDTO> => apiClient.post('/inventory', data),
  update: (id: number, data: Partial<InventaryDTO>): Promise<InventaryDTO> => apiClient.put(`/inventory/${id}`, data),
  delete: (id: number): Promise<void> => apiClient.delete(`/inventory/${id}`),
};
