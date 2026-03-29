import React from 'react';
import { Download, Eye, Receipt, Calendar, Car, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const invoices = [
  {
    id: 'INV-2024-042',
    date: '2026-02-03',
    vehicle: 'Honda Civic 2021',
    service: 'Brake Replacement',
    amount: 4500,
    status: 'paid' as const,
  },
  {
    id: 'INV-2024-038',
    date: '2026-01-15',
    vehicle: 'Toyota Camry 2022',
    service: 'Full Service',
    amount: 8200,
    status: 'paid' as const,
  },
  {
    id: 'INV-2024-045',
    date: '2026-02-07',
    vehicle: 'Toyota Camry 2022',
    service: 'AC Repair',
    amount: 3500,
    status: 'pending' as const,
  },
  {
    id: 'INV-2024-030',
    date: '2025-12-20',
    vehicle: 'Honda Civic 2021',
    service: 'Oil Change',
    amount: 1200,
    status: 'paid' as const,
  },
];

const statusConfig = {
  paid: { icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: 'Paid', color: 'text-green-600', border: 'border-border', bg: 'bg-green-500/5' },
  pending: { icon: <Clock className="h-4 w-4 text-yellow-500" />, label: 'Pending', color: 'text-yellow-600', border: 'border-yellow-500/30', bg: 'bg-yellow-500/5' },
  overdue: { icon: <AlertCircle className="h-4 w-4 text-destructive" />, label: 'Overdue', color: 'text-destructive', border: 'border-destructive/30', bg: 'bg-destructive/5' },
};

export const MyInvoices: React.FC = () => {
  const { formatCurrency } = useSettings();
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Invoices</h1>
          <p className="text-muted-foreground mt-1">View and download your service invoices.</p>
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Invoice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {invoices.map((inv) => {
          const config = statusConfig[inv.status] || statusConfig.pending;
          return (
            <div
              key={inv.id}
              className={`bg-card rounded-xl border p-6 ${config.border}`}
            >
              {/* Header */}
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

              {/* Details grid */}
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

              {/* Amount & Actions */}
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(inv.amount)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Download">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {inv.status === 'pending' && (
                <div className="mt-4 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                  <p className="text-xs text-muted-foreground">
                    This invoice is pending payment. Please complete the payment to avoid late fees.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
