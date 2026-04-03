import { apiClient } from './config';
import { ApiError } from './config';

export type PaymentMode = 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING';
export type InvoiceStatus = 'PENDING_MECHANIC' | 'FINALIZED' | 'PAID';

export interface InvoiceDTO {
  id: number;
  billDate: string;
  mechanicAmount: number;
  sparePartAmount: number;
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalBill: number;
  paymentMode: PaymentMode;
  billStatus: InvoiceStatus;
  jobCard_id: number;
  currency?: string;
}

export type CreateInvoiceDto = Omit<InvoiceDTO, 'id'>;
type UpdateInvoiceDto = Partial<InvoiceDTO> & { status?: string };

const unsupported = (message: string) => Promise.reject(new ApiError(405, message));

const isDemoSession = (): boolean => {
  const token = localStorage.getItem('token');
  return token === 'demo-token';
};

const getStoredUserRole = (): string | undefined => {
  const storedUser = localStorage.getItem('garage_user');
  if (!storedUser) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(storedUser) as { role?: string };
    return String(parsed.role ?? '').replace(/^ROLE_/i, '').toUpperCase();
  } catch {
    return undefined;
  }
};

export const billingApi = {
  getAll: (): Promise<InvoiceDTO[]> => {
    if (isDemoSession()) {
      return Promise.resolve([]);
    }
    const role = getStoredUserRole();
    const endpoint = role === 'ADMIN' ? '/admin/bill/getAllBills' : '/user/bill/getAll';
    return apiClient.get(endpoint);
  },
  getByVehicleId: async (vehicleId: number): Promise<InvoiceDTO> => {
    const bills = await apiClient.get(`/user/bill/getAllBillsOfVehicle/${vehicleId}`);
    if (!Array.isArray(bills) || bills.length === 0) {
      throw new ApiError(404, 'Invoice not found');
    }
    return bills[0];
  },
  create: (): Promise<InvoiceDTO> => unsupported('Create invoice endpoint is not available in backend yet'),
  update: (id: number, data: UpdateInvoiceDto): Promise<InvoiceDTO> => {
    const normalizedStatus = String(data.billStatus ?? data.status ?? '').trim().toUpperCase();

    let billStatus: InvoiceStatus;
    if (normalizedStatus === 'PAID') {
      billStatus = 'PAID';
    } else if (normalizedStatus === 'PENDING' || normalizedStatus === 'FINALIZED' || normalizedStatus === 'PENDING_MECHANIC') {
      billStatus = 'FINALIZED';
    } else {
      return unsupported('Only pending/paid status updates are supported by backend');
    }

    return apiClient.put(`/admin/bill/${id}/status`, { billStatus });
  },
  delete: (): Promise<void> => unsupported('Delete invoice endpoint is not available in backend yet'),
};
