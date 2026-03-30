import { apiClient } from './config';
import { ApiError } from './config';

export interface InventaryDTO {
  id: number;
  partName: string;
  partStock: number;
  partPrice: number;
  manufacture: string;
  jobCardIds?: number[] | null;
}

export type CreateInventaryDto = Omit<InventaryDTO, 'id'>;

const unsupported = (message: string) => Promise.reject(new ApiError(405, message));

export const inventoryApi = {
  getAll: (): Promise<InventaryDTO[]> => apiClient.get('/admin/SparePart/getAll'),
  getById: (id: number): Promise<InventaryDTO> => apiClient.get(`/admin/SparePart/get/${id}`),
  create: (data: CreateInventaryDto): Promise<InventaryDTO> => apiClient.post('/admin/SparePart/create', data),
  update: (): Promise<InventaryDTO> => unsupported('Update inventory endpoint is not available in backend yet'),
  delete: (): Promise<void> => unsupported('Delete inventory endpoint is not available in backend yet'),
};
