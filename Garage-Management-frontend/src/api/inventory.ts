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

export const inventoryApi = {
  getAll: async (): Promise<InventaryDTO[]> => {
    if (isDemoSession()) {
      return [];
    }

    const role = getStoredUserRole();
    if ((role !== 'ADMIN' && role !== 'MECHANIC') || !hasUsableToken()) {
      return [];
    }

    try {
      return await apiClient.get('/admin/SparePart/getAll');
    } catch (error) {
      if (isRecoverableListError(error)) {
        return [];
      }
      throw error;
    }
  },
  getById: (id: number): Promise<InventaryDTO> => apiClient.get(`/admin/SparePart/get/${id}`),
  create: (data: CreateInventaryDto): Promise<InventaryDTO> => apiClient.post('/admin/SparePart/create', data),
  update: (): Promise<InventaryDTO> => unsupported('Update inventory endpoint is not available in backend yet'),
  delete: (): Promise<void> => unsupported('Delete inventory endpoint is not available in backend yet'),
};
