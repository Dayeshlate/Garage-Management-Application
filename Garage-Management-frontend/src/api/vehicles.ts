import { apiClient } from './config';
import { ApiError } from './config';

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
  ownerPhone: string;
  ownerEmail: string;
  userEmail: string;
}

export type CreateVehicleDto = Omit<VehicleDTO, 'id' | 'vehicleType' | 'vehicleStatus' | 'arrivalTime' | 'expectedTime' | 'deliveryTime' | 'userEmail'>;

const unsupported = (message: string) => Promise.reject(new ApiError(405, message));

export const vehiclesApi = {
  getAll: (): Promise<VehicleDTO[]> => apiClient.get('/admin/getAllVehicles'),
  getById: (id: number): Promise<VehicleDTO> => apiClient.get(`/admin/vehicle/get/${id}`),
  getMyVehicles: (): Promise<VehicleDTO[]> => apiClient.get('/user/vehicle/allUservehicle'),
  getPending: (): Promise<VehicleDTO[]> => apiClient.get('/admin/vehicle/pending'),
  create: (data: CreateVehicleDto): Promise<VehicleDTO> => apiClient.post('/user/vehicle/create', data),
  update: (id: number, data: Partial<VehicleDTO>): Promise<VehicleDTO> => apiClient.put('/admin/vehicle/update', { id, ...data }),
  approve: (id: number): Promise<VehicleDTO> => apiClient.put(`/admin/vehicle/${id}/approve`, {}),
  reject: (id: number): Promise<VehicleDTO> => apiClient.put(`/admin/vehicle/${id}/reject`, {}),
  delete: (): Promise<void> => unsupported('Delete vehicle endpoint is not available in backend yet'),
};
