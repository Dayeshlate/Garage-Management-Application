import { apiClient } from './config';
import { ApiError } from './config';

export type PaymentMode = 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING';
export type InvoiceStatus = 'PENDING_MECHANIC' | 'FINALIZED' | 'PAID';

export interface InvoiceDTO {
  id: number;
  billDate: string;
  mechanicAmount: number;
  sparePartAmount: number;
  totalBill: number;
  paymentMode: PaymentMode;
  billStatus: InvoiceStatus;
  jobCard_id: number;
  currency?: string;
}

export type CreateInvoiceDto = Omit<InvoiceDTO, 'id'>;

const unsupported = (message: string) => Promise.reject(new ApiError(405, message));

const getStoredUserRole = (): string | undefined => {
  const storedUser = localStorage.getItem('garage_user');
  if (!storedUser) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(storedUser) as { role?: string };
    return parsed.role;
  } catch {
    return undefined;
  }
};

export const billingApi = {
  getAll: (): Promise<InvoiceDTO[]> => {
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
  update: (): Promise<InvoiceDTO> => unsupported('Update invoice endpoint is not available in backend yet'),
  delete: (): Promise<void> => unsupported('Delete invoice endpoint is not available in backend yet'),
};
