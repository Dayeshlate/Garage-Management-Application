import { apiClient } from './config';
import { ApiError } from './config';

export type PaymentMode = 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING';
export type InvoiceStatus = 'PENDING_LABOUR' | 'FINALIZED' | 'PAID';

export interface InvoiceDTO {
  id: number;
  billDate: string;
  labourAmount: number;
  sparePartAmount: number;
  totalBill: number;
  paymentMode: PaymentMode;
  billStatus: InvoiceStatus;
  jobCard_id: number;
}

export type CreateInvoiceDto = Omit<InvoiceDTO, 'id'>;

const unsupported = (message: string) => Promise.reject(new ApiError(405, message));

export const billingApi = {
  getAll: (): Promise<InvoiceDTO[]> => apiClient.get('/user/bill/getAll'),
  getById: async (id: number): Promise<InvoiceDTO> => {
    const bills = await apiClient.get(`/user/bill/getAllBillsOfVehicle/${id}`);
    if (!Array.isArray(bills) || bills.length === 0) {
      throw new ApiError(404, 'Invoice not found');
    }
    return bills[0];
  },
  create: (): Promise<InvoiceDTO> => unsupported('Create invoice endpoint is not available in backend yet'),
  update: (): Promise<InvoiceDTO> => unsupported('Update invoice endpoint is not available in backend yet'),
  delete: (): Promise<void> => unsupported('Delete invoice endpoint is not available in backend yet'),
};
