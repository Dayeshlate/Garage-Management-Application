import { apiClient } from './config';

export type PaymentMode = 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING';
export type InvoiceStatus = 'PAID' | 'UNPAID' | 'PARTIALLY_PAID' | 'CANCELLED';

export interface InvoiceDTO {
  id: number;
  invoiceDate: string;
  labourAmount: number;
  sparePartAmount: number;
  totalInvoice: number;
  paymentMode: PaymentMode;
  invoiceStatus: InvoiceStatus;
  jobCard_id: number;
}

export type CreateInvoiceDto = Omit<InvoiceDTO, 'id'>;

export const billingApi = {
  getAll: (): Promise<InvoiceDTO[]> => apiClient.get('/invoices'),
  getById: (id: number): Promise<InvoiceDTO> => apiClient.get(`/invoices/${id}`),
  create: (data: CreateInvoiceDto): Promise<InvoiceDTO> => apiClient.post('/invoices', data),
  update: (id: number, data: Partial<InvoiceDTO>): Promise<InvoiceDTO> => apiClient.put(`/invoices/${id}`, data),
  delete: (id: number): Promise<void> => apiClient.delete(`/invoices/${id}`),
};
