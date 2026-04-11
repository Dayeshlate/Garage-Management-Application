import React, { useMemo, useState } from 'react';
import { Download, Eye, Receipt, Calendar, Car, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useInvoices } from '@/hooks/use-api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const statusConfig = {
  paid: { icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: 'Paid', color: 'text-green-600', border: 'border-border' },
  pending: { icon: <Clock className="h-4 w-4 text-yellow-500" />, label: 'Pending', color: 'text-yellow-600', border: 'border-yellow-500/30' },
  overdue: { icon: <AlertCircle className="h-4 w-4 text-destructive" />, label: 'Overdue', color: 'text-destructive', border: 'border-destructive/30' },
};

export const MyInvoices: React.FC = () => {
  const { formatCurrency } = useSettings();
  const { data, isLoading, error } = useInvoices();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const toNumber = (value: unknown): number => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const toUserStatus = (status?: string): 'paid' | 'pending' | 'overdue' => {
    const normalized = String(status ?? '').toUpperCase();
    if (normalized === 'PAID') return 'paid';
    if (normalized === 'OVERDUE') return 'overdue';
    return 'pending';
  };

  const invoices = useMemo(
    () =>
      (data ?? [])
      .slice()
      .sort((a, b) => Number(b.id) - Number(a.id))
      .map((invoice) => {
        const mechanicAmount = toNumber(invoice.mechanicAmount);
        const sparePartAmount = toNumber(invoice.sparePartAmount);
        const subtotal = toNumber(invoice.subtotal);
        const total = toNumber(invoice.totalBill);
        const tax = toNumber(invoice.taxAmount);

        return {
        id: `INV-${invoice.id}`,
        rawId: Number(invoice.id),
        date: invoice.billDate,
        vehicle: `${invoice.vehicleBrand || 'N/A'} ${invoice.vehicleModel || 'N/A'} (${invoice.vehicleNumber || 'N/A'})`,
        service: `Job Card #${invoice.jobCard_id}`,
        mechanicAmount,
        sparePartAmount,
        subtotal,
        tax,
        amount: total,
        paymentMode: invoice.paymentMode ?? 'N/A',
        billStatus: invoice.billStatus,
        status: toUserStatus(invoice.billStatus),
      };
      }),
    [data]
  );

  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) ?? null;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Invoices</h1>
          <p className="text-muted-foreground mt-1">View and download your service invoices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(invoices.reduce((a, b) => a + b.amount, 0))}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold text-accent mt-1">
            {formatCurrency(invoices.filter(i => i.status === 'paid').reduce((a, b) => a + b.amount, 0))}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-destructive mt-1">
            {formatCurrency(invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0))}
          </p>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading invoices...</p>}
      {error && <p className="text-sm text-destructive">Failed to load invoices from database.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {invoices.map((inv) => {
          const config = statusConfig[inv.status] || statusConfig.pending;
          return (
            <div
              key={inv.id}
              className={`bg-card rounded-xl border p-6 ${config.border}`}
              onClick={() => setSelectedInvoiceId(inv.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Receipt className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{inv.id}</h3>
                    <p className="text-sm text-muted-foreground">{inv.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {config.icon}
                  <span className={config.color}>{config.label}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicle</p>
                    <p className="text-sm font-medium text-foreground">{inv.vehicle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(inv.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(inv.amount)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="View"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInvoiceId(inv.id);
                    }}
                  >
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Download">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoiceId(null)}>
        <DialogContent className="max-w-2xl">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedInvoice.id}</DialogTitle>
                <DialogDescription>
                  Full invoice details for {selectedInvoice.service}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Invoice Date</p>
                    <p className="font-medium text-foreground">
                      {selectedInvoice.date ? new Date(selectedInvoice.date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-medium text-foreground capitalize">{selectedInvoice.status}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Payment Mode</p>
                    <p className="font-medium text-foreground">{selectedInvoice.paymentMode}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Backend Bill Status</p>
                    <p className="font-medium text-foreground">{selectedInvoice.billStatus}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4 space-y-3">
                  <h4 className="font-semibold text-foreground">Amount Breakdown</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mechanic Amount</span>
                    <span className="font-medium text-foreground">{formatCurrency(selectedInvoice.mechanicAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Inventory / Spare Parts</span>
                    <span className="font-medium text-foreground">{formatCurrency(selectedInvoice.sparePartAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium text-foreground">{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-foreground">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Vehicle</p>
                    <p className="font-medium text-foreground">{selectedInvoice.vehicle}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Service Reference</p>
                    <p className="font-medium text-foreground">{selectedInvoice.service}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
