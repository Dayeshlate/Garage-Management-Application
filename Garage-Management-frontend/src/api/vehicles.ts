import { apiClient } from './config';

export type VehicleStatus = 'PENDING' | 'IN_SERVICE' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED';
export type ServiceType = 'GENERAL_SERVICE' | 'REPAIR' | 'BODY_WORK' | 'ELECTRICAL' | 'AC_SERVICE' | 'WASHING';

export interface VehicleDTO {
  id: number;
  vehicleNumber: string;
  vehicleType: string;
  serviceType: ServiceType;
  brand: string;
  model: string;
  vehicleStatus: VehicleStatus;
  problemDescription: string;
  solutionDescription: string;
  arrivalTime: string;
  expectedTime: string;
  deliveryTime: string;
  ownerName: string;
  userEmail: string;
}

export type CreateVehicleDto = Omit<VehicleDTO, 'id'>;

export const vehiclesApi = {
  getAll: (): Promise<VehicleDTO[]> => apiClient.get('/vehicles'),
  getById: (id: number): Promise<VehicleDTO> => apiClient.get(`/vehicles/${id}`),
  getMyVehicles: (): Promise<VehicleDTO[]> => apiClient.get('/vehicles/my'),
  getPending: (): Promise<VehicleDTO[]> => apiClient.get('/vehicles/pending'),
  create: (data: CreateVehicleDto): Promise<VehicleDTO> => apiClient.post('/vehicles', data),
  update: (id: number, data: Partial<VehicleDTO>): Promise<VehicleDTO> => apiClient.put(`/vehicles/${id}`, data),
  delete: (id: number): Promise<void> => apiClient.delete(`/vehicles/${id}`),
};
