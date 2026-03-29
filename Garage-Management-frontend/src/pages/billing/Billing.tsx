import React, { useState } from 'react';
import { Plus, Search, Download, MoreVertical, Receipt, CheckCircle, Clock, XCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { BillDetailPanel } from '@/components/BillDetailPanel';
import { UnfilledBillCard } from '@/components/UnfilledBillCard';
import { useSettings } from '@/context/SettingsContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'cancelled' | 'unfilled';

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

const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-001', customer: 'John Smith', jobCard: 'JC-2024-003', amount: 250, tax: 30, total: 280, status: 'paid', dueDate: '2024-03-25', createdAt: '2024-03-18', paidAt: '2024-03-19' },
  { id: '2', invoiceNumber: 'INV-2024-002', customer: 'Sarah Wilson', jobCard: 'JC-2024-002', amount: 400, tax: 50, total: 450, status: 'pending', dueDate: '2024-03-28', createdAt: '2024-03-18' },
  { id: '3', invoiceNumber: 'INV-2024-003', customer: 'Mike Johnson', jobCard: 'JC-2024-005', amount: 100, tax: 20, total: 120, status: 'paid', dueDate: '2024-03-22', createdAt: '2024-03-17', paidAt: '2024-03-17' },
  { id: '4', invoiceNumber: 'INV-2024-004', customer: 'Emily Davis', jobCard: 'JC-2024-004', amount: 300, tax: 50, total: 350, status: 'pending', dueDate: '2024-03-26', createdAt: '2024-03-18' },
  { id: '5', invoiceNumber: 'INV-2024-005', customer: 'Robert Brown', jobCard: 'JC-2024-008', amount: 85, tax: 15, total: 100, status: 'paid', dueDate: '2024-03-24', createdAt: '2024-03-17', paidAt: '2024-03-18' },
  { id: '6', invoiceNumber: 'INV-2024-006', customer: 'Lisa Anderson', jobCard: 'JC-2024-006', amount: 480, tax: 70, total: 550, status: 'overdue', dueDate: '2024-03-15', createdAt: '2024-03-10' },
  { id: '7', invoiceNumber: 'INV-2024-007', customer: 'David Martinez', jobCard: 'JC-2024-007', amount: 180, tax: 20, total: 200, status: 'cancelled', dueDate: '2024-03-20', createdAt: '2024-03-15' },
  { id: '8', invoiceNumber: 'INV-2024-008', customer: 'Jennifer Taylor', jobCard: 'JC-2024-001', amount: 130, tax: 20, total: 150, status: 'pending', dueDate: '2024-03-27', createdAt: '2024-03-18' },
  { id: '9', invoiceNumber: 'INV-2024-009', customer: 'Chris Evans', jobCard: 'JC-2024-009', amount: 0, tax: 0, total: 0, status: 'unfilled', dueDate: '2024-03-30', createdAt: '2024-03-19' },
  { id: '10', invoiceNumber: 'INV-2024-010', customer: 'Anna White', jobCard: 'JC-2024-010', amount: 0, tax: 0, total: 0, status: 'unfilled', dueDate: '2024-03-31', createdAt: '2024-03-20' },
];

const statusConfig: Record<PaymentStatus, { label: string; icon: React.ElementType; className: string }> = {
  paid: { label: 'Paid', icon: CheckCircle, className: 'text-status-completed bg-status-completed/10' },
  pending: { label: 'Pending', icon: Clock, className: 'text-status-pending bg-status-pending/10' },
  overdue: { label: 'Overdue', icon: XCircle, className: 'text-status-cancelled bg-status-cancelled/10' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'text-muted-foreground bg-muted' },
  unfilled: { label: 'Unfilled', icon: Clock, className: 'text-status-pending bg-status-pending/10' },
};

export const Billing: React.FC = () => {
  const { formatCurrency } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleUnfilledSubmit = (id: string, labourAmount: number, taxRate: number) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              amount: labourAmount,
              tax: labourAmount * (taxRate / 100),
              total: labourAmount + labourAmount * (taxRate / 100),
              status: 'pending' as PaymentStatus,
            }
          : inv
      )
    );
  };

  const handleUpdateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv))
    );
    if (selectedInvoice?.id === id) {
      setSelectedInvoice((prev) => prev ? { ...prev, ...updates } : prev);
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
  const unfilledInvoices = invoices.filter((i) => i.status === 'unfilled');

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
      header: 'Due Date',
      render: (invoice: Invoice) => (
        <span className="text-muted-foreground">
          {new Date(invoice.dueDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (invoice: Invoice) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>View Invoice</DropdownMenuItem>
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem>Send to Customer</DropdownMenuItem>
            <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Void Invoice</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing</h1>
          <p className="text-muted-foreground mt-1">Manage invoices and payments</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'paid', 'pending', 'overdue', 'cancelled', 'unfilled'] as const).map((status) => (
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

      {/* Search */}
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

      {/* Unfilled Bills Section */}
      {statusFilter === 'unfilled' ? (
        unfilledInvoices.length > 0 ? (
          <div className="space-y-4">
            {unfilledInvoices.map((invoice) => (
              <UnfilledBillCard
                key={invoice.id}
                invoice={invoice}
                onSubmit={handleUnfilledSubmit}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground">No unfilled invoices</p>
          </div>
        )
      ) : (
        /* Data Table */
        <DataTable
          columns={columns}
          data={filteredInvoices}
          emptyMessage="No invoices found"
          onRowClick={setSelectedInvoice}
        />
      )}

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
