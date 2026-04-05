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

const getStoredToken = (): string | undefined => {
  const directToken = localStorage.getItem('token') || undefined;
  if (directToken) {
    return directToken;
  }

  const storedUser = localStorage.getItem('garage_user');
  if (!storedUser) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(storedUser) as { token?: string };
    return parsed.token;
  } catch {
    return undefined;
  }
};

const hasUsableToken = (): boolean => {
  const token = getStoredToken();
  if (!token || token === 'demo-token') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return true;
  }

  try {
    const payload = JSON.parse(atob(parts[1])) as { exp?: number };
    if (typeof payload.exp !== 'number') {
      return true;
    }
    return payload.exp * 1000 > Date.now();
  } catch {
    return true;
  }
};

const getStoredUserRole = (): string | undefined => {
  const storedUser = localStorage.getItem('garage_user');
  if (!storedUser) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(storedUser) as { role?: string };
    return String(parsed.role ?? '').trim().replace(/^ROLE_/i, '').toUpperCase();
  } catch {
    return undefined;
  }
};

const isRecoverableListError = (error: unknown): boolean => {
  if (error instanceof ApiError && [0, 401, 403].includes(error.status)) {
    return true;
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = Number((error as { status?: unknown }).status);
    return [0, 401, 403].includes(status);
  }

  return false;
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
    if (isDemoSession()) {
      return [];
    }

    const role = getStoredUserRole();
    if ((role !== 'ADMIN' && role !== 'MECHANIC') || !hasUsableToken()) {
      return [];
    }

    try {
      const data = await apiClient.get('/admin/jobcard/getAllJobCards');
      return (data ?? []).map(normalizeJobCard);
    } catch (error) {
      if (isRecoverableListError(error)) {
        return [];
      }
      throw error;
    }
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
    if (isDemoSession()) {
      return unsupported('Update job card is not available in demo mode');
    }
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
