import React, { useState, useEffect } from 'react';
import { X, Receipt, Calendar, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'cancelled' | 'unfilled';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  jobCard: string;
  vehicle: string;
  amount: number;
  tax: number;
  total: number;
  status: PaymentStatus;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

interface BillDetailPanelProps {
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Invoice>) => void;
}

const statusConfig: Record<PaymentStatus, { label: string; icon: React.ElementType; className: string }> = {
  paid: { label: 'Paid', icon: CheckCircle, className: 'text-status-completed bg-status-completed/10' },
  pending: { label: 'Pending', icon: Clock, className: 'text-status-pending bg-status-pending/10' },
  overdue: { label: 'Overdue', icon: XCircle, className: 'text-status-cancelled bg-status-cancelled/10' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'text-muted-foreground bg-muted' },
  unfilled: { label: 'Unfilled', icon: Clock, className: 'text-status-pending bg-status-pending/10' },
};

const toSafeNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const toSafeDateInput = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }
  return '';
};

const toSafeStatus = (value: unknown): PaymentStatus => {
  if (value === 'paid' || value === 'pending' || value === 'overdue' || value === 'cancelled' || value === 'unfilled') {
    return value;
  }
  return 'pending';
};

const formatDate = (value?: string): string => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const BillDetailPanel: React.FC<BillDetailPanelProps> = ({
  invoice,
  open,
  onClose,
  onUpdate,
}) => {
  const { formatCurrency, currencySymbol } = useSettings();
  const [editingAmount, setEditingAmount] = useState(toSafeNumber(invoice.amount));
  const [editingTax, setEditingTax] = useState(toSafeNumber(invoice.tax));
  const [editingStatus, setEditingStatus] = useState<PaymentStatus>(toSafeStatus(invoice.status));
  const [editingDueDate, setEditingDueDate] = useState(toSafeDateInput(invoice.dueDate));

  const tax = editingAmount * (editingTax > 0 && editingTax < 1 ? editingTax : editingTax / 100);
  const total = editingAmount + tax;

  useEffect(() => {
    setEditingAmount(toSafeNumber(invoice.amount));
    setEditingTax(toSafeNumber(invoice.tax));
    setEditingStatus(toSafeStatus(invoice.status));
    setEditingDueDate(toSafeDateInput(invoice.dueDate));
  }, [invoice]);

  const handleAmountChange = () => {
    onUpdate(invoice.id, {
      amount: editingAmount,
      tax: tax,
      total: total,
    });
    toast({
      title: 'Invoice updated',
      description: `Amount changed to ${formatCurrency(editingAmount)}`,
    });
  };

  const handleTaxChange = () => {
    onUpdate(invoice.id, {
      tax: tax,
      total: total,
    });
    toast({
      title: 'Tax updated',
      description: `Tax set to ${formatCurrency(tax)}`,
    });
  };

  const handleStatusChange = (newStatus: PaymentStatus) => {
    setEditingStatus(newStatus);
    const updates: Partial<Invoice> = { status: newStatus };
    if (newStatus === 'paid') {
      updates.paidAt = new Date().toISOString().split('T')[0];
    } else {
      updates.paidAt = undefined;
    }
    onUpdate(invoice.id, updates);
    toast({
      title: 'Status updated',
      description: `Invoice status changed to ${statusConfig[newStatus].label}`,
    });
  };

  const handleDueDateChange = () => {
    onUpdate(invoice.id, { dueDate: editingDueDate });
    toast({
      title: 'Due date updated',
      description: `Due date changed to ${formatDate(editingDueDate)}`,
    });
  };

  const handleSaveChanges = () => {
    const updates: Partial<Invoice> = {
      dueDate: editingDueDate,
      status: editingStatus,
    };

    if (editingStatus === 'paid') {
      updates.paidAt = invoice.paidAt ?? new Date().toISOString().split('T')[0];
    } else {
      updates.paidAt = undefined;
    }

    onUpdate(invoice.id, updates);
    toast({
      title: 'Invoice saved',
      description: 'Your invoice changes have been saved.',
    });
  };

  const StatusIcon = statusConfig[editingStatus].icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto transition-transform duration-300 ease-out shadow-2xl',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Receipt className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-mono text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
              <h2 className="text-lg font-bold text-foreground">Invoice Details</h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-fade-in">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <StatusIcon className="h-4 w-4 text-accent" />
              Payment Status
            </h3>

            <div className="space-y-3">
              <Select value={editingStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {editingStatus === 'paid' && invoice.paidAt && (
                <div className="bg-status-completed/10 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-status-completed" />
                  <p className="text-sm text-status-completed">
                    Paid on {formatDate(invoice.paidAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-fade-in">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4 text-accent" />
              Invoice Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Customer</label>
                <input
                  type="text"
                  value={invoice.customer ?? ''}
                  disabled
                  className="input-field bg-muted text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Vehicle</label>
                <input
                  type="text"
                  value={invoice.vehicle ?? ''}
                  disabled
                  className="input-field bg-muted text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Job Card</label>
                <input
                  type="text"
                  value={invoice.jobCard ?? ''}
                  disabled
                  className="input-field bg-muted text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Due Date</label>
              <input
                type="date"
                value={editingDueDate}
                onChange={(e) => setEditingDueDate(e.target.value)}
                onBlur={handleDueDateChange}
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Created</label>
              <input
                type="text"
                value={formatDate(invoice.createdAt)}
                disabled
                className="input-field bg-muted text-muted-foreground"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-fade-in">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-accent" />
              Pricing & Payment
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Amount</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{currencySymbol}</span>
                <input
                  type="number"
                  value={editingAmount}
                  onChange={(e) => setEditingAmount(Number(e.target.value))}
                  onBlur={handleAmountChange}
                  className="input-field flex-1"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tax</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{currencySymbol}</span>
                <input
                  type="number"
                  value={editingTax}
                  onChange={(e) => setEditingTax(Number(e.target.value))}
                  onBlur={handleTaxChange}
                  className="input-field flex-1"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              <div className="bg-card rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(editingAmount)}</p>
              </div>
              <div className="bg-card rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Tax</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(tax)}</p>
              </div>
              <div className="bg-accent/10 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                <p className="text-sm font-bold text-accent">{formatCurrency(total)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" variant="outline" onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button className="flex-1">
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
