import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi, type Customer, type CreateCustomerDto } from '@/api/customers';
import { vehiclesApi, type VehicleDTO, type CreateVehicleDto } from '@/api/vehicles';
import { jobCardsApi, type JobCardDTO, type CreateJobCardDto } from '@/api/jobcards';
import { inventoryApi, type InventaryDTO, type CreateInventaryDto } from '@/api/inventory';
import { billingApi, type InvoiceDTO, type CreateInvoiceDto } from '@/api/billing';

// ─── Customers ───────────────────────────────────────
export const useCustomers = () =>
  useQuery({ queryKey: ['customers'], queryFn: customersApi.getAll });

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Customer> }) => customersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
};

export const useDeleteCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => customersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
};

// ─── Vehicles ────────────────────────────────────────
export const useVehicles = () =>
  useQuery({ queryKey: ['vehicles'], queryFn: vehiclesApi.getAll });

export const useMyVehicles = () =>
  useQuery({ queryKey: ['vehicles', 'my'], queryFn: vehiclesApi.getMyVehicles });

export const usePendingVehicles = () =>
  useQuery({ queryKey: ['vehicles', 'pending'], queryFn: vehiclesApi.getPending });

export const useCreateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVehicleDto) => vehiclesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
};

export const useUpdateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VehicleDTO> }) => vehiclesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
};

export const useDeleteVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vehiclesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
};

// ─── Job Cards ───────────────────────────────────────
export const useJobCards = () =>
  useQuery({ queryKey: ['jobCards'], queryFn: jobCardsApi.getAll });

export const useCreateJobCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobCardDto) => jobCardsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobCards'] }),
  });
};

export const useUpdateJobCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<JobCardDTO> }) => jobCardsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobCards'] }),
  });
};

export const useDeleteJobCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => jobCardsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobCards'] }),
  });
};

// ─── Inventory ───────────────────────────────────────
export const useInventory = () =>
  useQuery({ queryKey: ['inventory'], queryFn: inventoryApi.getAll });

export const useCreateInventoryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventaryDto) => inventoryApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }),
  });
};

export const useUpdateInventoryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InventaryDTO> }) => inventoryApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }),
  });
};

export const useDeleteInventoryItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => inventoryApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }),
  });
};

// ─── Billing / Invoices ─────────────────────────────
export const useInvoices = () =>
  useQuery({ queryKey: ['invoices'], queryFn: billingApi.getAll });

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvoiceDto) => billingApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useUpdateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InvoiceDTO> }) => billingApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useDeleteInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => billingApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};
