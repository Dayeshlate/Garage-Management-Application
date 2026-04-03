import React, { useMemo, useState } from 'react';
import { Search, Receipt, CheckCircle, Clock, XCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { BillDetailPanel } from '@/components/BillDetailPanel';
import { useSettings } from '@/context/SettingsContext';
import { useInvoices, useUpdateInvoice } from '@/hooks/use-api';

type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  jobCard: string;
  amount: number;
  tax: number;
  total: number;
  status: PaymentStatus;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

const statusConfig: Record<PaymentStatus, { label: string; icon: React.ElementType; className: string }> = {
  paid: { label: 'Paid', icon: CheckCircle, className: 'text-status-completed bg-status-completed/10' },
  pending: { label: 'Pending', icon: Clock, className: 'text-status-pending bg-status-pending/10' },
  overdue: { label: 'Overdue', icon: XCircle, className: 'text-status-cancelled bg-status-cancelled/10' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'text-muted-foreground bg-muted' },
};

const normalizeStatus = (status?: string): PaymentStatus => {
  const normalized = String(status ?? '').trim().toUpperCase();

  if (normalized === 'PAID' || normalized === 'PADE') return 'paid';
  if (normalized === 'OVERDUE') return 'overdue';
  if (normalized === 'CANCELLED') return 'cancelled';
  if (normalized === 'FINALIZED' || normalized === 'PENDING_MECHANIC' || normalized === 'PENDING_LABOUR') {
    return 'pending';
  }

  if (normalized.includes('PAID')) return 'paid';
  if (normalized.includes('PENDING') || normalized.includes('FINAL')) return 'pending';

  return 'pending';
};

const toNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const Billing: React.FC = () => {
  const { formatCurrency } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceEdits, setInvoiceEdits] = useState<Record<string, Partial<Invoice>>>({});

  const { data, isLoading, error } = useInvoices();
  const updateInvoice = useUpdateInvoice();

  const invoices: Invoice[] = useMemo(
    () =>
      (data ?? [])
      .slice()
      .sort((a, b) => Number(b.id) - Number(a.id))
      .map((invoice) => {
        const id = String(invoice.id);
        const baseInvoice: Invoice = {
          id,
          invoiceNumber: `INV-${invoice.id}`,
          customer: `Customer #${invoice.jobCard_id}`,
          jobCard: `JC-${invoice.jobCard_id}`,
          amount: toNumber(invoice.mechanicAmount) + toNumber(invoice.sparePartAmount),
          tax: 0,
          total: toNumber(invoice.totalBill),
          status: normalizeStatus(invoice.billStatus),
          dueDate: invoice.billDate,
          createdAt: invoice.billDate,
          paidAt: invoice.billStatus === 'PAID' ? invoice.billDate : undefined,
        };

        return {
          ...baseInvoice,
          ...(invoiceEdits[id] ?? {}),
        };
      }),
    [data, invoiceEdits]
  );

  const handleUpdateInvoice = (id: string, updates: Partial<Invoice>) => {
    const normalizedUpdates: Partial<Invoice> = {
      ...updates,
      status: updates.status ? normalizeStatus(updates.status) : updates.status,
      amount: updates.amount !== undefined ? toNumber(updates.amount) : updates.amount,
      tax: updates.tax !== undefined ? toNumber(updates.tax) : updates.tax,
      total: updates.total !== undefined ? toNumber(updates.total) : updates.total,
    };

    setInvoiceEdits((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {}),
        ...normalizedUpdates,
      },
    }));

    if (selectedInvoice?.id === id) {
      setSelectedInvoice((prev) => (prev ? { ...prev, ...normalizedUpdates } : prev));
    }

    if (normalizedUpdates.status) {
      const billStatus = normalizedUpdates.status === 'paid' ? 'PAID' : 'FINALIZED';
      updateInvoice.mutate(
        { id: Number(id), data: { billStatus } },
        {
          onSuccess: () => {
            setInvoiceEdits((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          },
        }
      );
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = invoices.filter((i) => i.status === 'pending').reduce((sum, i) => sum + i.total, 0);
  const overdueAmount = invoices.filter((i) => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice',
      render: (invoice: Invoice) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Receipt className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-mono font-medium text-accent">{invoice.invoiceNumber}</p>
            <p className="text-sm text-muted-foreground">{invoice.jobCard}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (invoice: Invoice) => (
        <span className="font-medium text-foreground">{invoice.customer}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (invoice: Invoice) => (
        <div className="text-sm">
          <p className="font-medium text-foreground">{formatCurrency(invoice.total)}</p>
          <p className="text-muted-foreground">incl. {formatCurrency(invoice.tax)} tax</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (invoice: Invoice) => {
        const config = statusConfig[invoice.status];
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'dueDate',
      header: 'Date',
      render: (invoice: Invoice) => (
        <span className="text-muted-foreground">
          {new Date(invoice.dueDate).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing</h1>
          <p className="text-muted-foreground mt-1">Manage invoices and payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-status-completed mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-status-pending mt-1">{formatCurrency(pendingAmount)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold text-destructive mt-1">{formatCurrency(overdueAmount)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Invoices</p>
          <p className="text-2xl font-bold text-foreground mt-1">{invoices.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'paid', 'pending', 'overdue', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading invoices...</p>}
      {error && <p className="text-sm text-destructive">Failed to load invoices from database.</p>}

      <DataTable
        columns={columns}
        data={filteredInvoices}
        emptyMessage="No invoices found"
        onRowClick={setSelectedInvoice}
      />

      {selectedInvoice && (
        <BillDetailPanel
          invoice={selectedInvoice}
          open={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onUpdate={handleUpdateInvoice}
        />
      )}
    </div>
  );
};
