import { apiClient } from './config';
import { ApiError } from './config';

export type JobStatus = 'ARRIVED' | 'IN_SERVICE' | 'WAITING_FOR_PART' | 'COMPLETED' | 'DELIVERED';

export interface JobCardDTO {
  id: number;
  jobStatus?: JobStatus;
  JobStatus?: JobStatus;
  vehicle_id?: number;
  Vehicle_id?: number;
  vehicleNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  sparePart_id?: number[];
  SparePart_id?: number[];
  sparePartNames?: string[];
  mechanicCharge?: number;
}

export type CreateJobCardDto = Omit<JobCardDTO, 'id'>;

const unsupported = (message: string) => Promise.reject(new ApiError(405, message));

const isDemoSession = (): boolean => {
  const token = localStorage.getItem('token');
  return token === 'demo-token';
};

const normalizeJobCard = (raw: any): JobCardDTO => ({
  id: Number(raw?.id),
  jobStatus: raw?.jobStatus ?? raw?.JobStatus,
  JobStatus: raw?.JobStatus ?? raw?.jobStatus,
  vehicle_id: raw?.vehicle_id ?? raw?.Vehicle_id,
  Vehicle_id: raw?.Vehicle_id ?? raw?.vehicle_id,
  vehicleNumber: raw?.vehicleNumber,
  vehicleBrand: raw?.vehicleBrand,
  vehicleModel: raw?.vehicleModel,
  ownerName: raw?.ownerName,
  ownerPhone: raw?.ownerPhone,
  ownerEmail: raw?.ownerEmail,
  sparePart_id: raw?.sparePart_id ?? raw?.SparePart_id,
  SparePart_id: raw?.SparePart_id ?? raw?.sparePart_id,
  sparePartNames: raw?.sparePartNames ?? raw?.SparePartNames,
  mechanicCharge: raw?.mechanicCharge ?? raw?.labourCharge,
});

export const jobCardsApi = {
  getAll: async (): Promise<JobCardDTO[]> => {
    const data = await apiClient.get('/admin/jobcard/getAllJobCards');
    return (data ?? []).map(normalizeJobCard);
  },
  getUserActive: async (): Promise<JobCardDTO[]> => {
    if (isDemoSession()) {
      return [];
    }
    const data = await apiClient.get('/user/jobCard/Active_Services');
    return (data ?? []).map(normalizeJobCard);
  },
  getUserActiveCount: (): Promise<number> => {
    if (isDemoSession()) {
      return Promise.resolve(0);
    }
    return apiClient.get('/user/jobCard/Active_count');
  },
  getById: async (id: number): Promise<JobCardDTO> => {
    const cards = await jobCardsApi.getAll();
    const card = cards.find((c) => c.id === id);
    if (!card) {
      throw new ApiError(404, 'Job card not found');
    }
    return card;
  },
  create: (): Promise<JobCardDTO> => unsupported('Create job card endpoint is not available in backend yet'),
  update: async (id: number, data: Partial<JobCardDTO>): Promise<JobCardDTO> => {
    const nextStatus = data.jobStatus ?? data.JobStatus;
    const nextSparePartIds = data.sparePart_id ?? data.SparePart_id;
    const updated = await apiClient.post('/admin/jobcard/update', {
      id,
      ...data,
      ...(nextStatus ? { jobStatus: nextStatus, JobStatus: nextStatus } : {}),
      ...(nextSparePartIds ? { sparePart_id: nextSparePartIds, SparePart_id: nextSparePartIds } : {}),
    });
    return normalizeJobCard(updated);
  },
  delete: (): Promise<void> => unsupported('Delete job card endpoint is not available in backend yet'),
};
