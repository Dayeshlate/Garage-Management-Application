import React, { useState } from 'react';
import { Receipt, Save } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { toast } from 'sonner';

interface UnfilledInvoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  jobCard: string;
  dueDate: string;
  createdAt: string;
}

interface UnfilledBillCardProps {
  invoice: UnfilledInvoice;
  onSubmit: (id: string, labourAmount: number, taxRate: number) => void;
}

export const UnfilledBillCard: React.FC<UnfilledBillCardProps> = ({ invoice, onSubmit }) => {
  const { formatCurrency, taxRate } = useSettings();
  const [labourAmount, setLabourAmount] = useState('');

  const labour = parseFloat(labourAmount) || 0;
  const tax = labour * (taxRate / 100);
  const total = labour + tax;

  const handleSubmit = () => {
    if (!labourAmount || parseFloat(labourAmount) <= 0) {
      toast.error('Please enter a valid labour amount');
      return;
    }
    onSubmit(invoice.id, labour, taxRate);
    toast.success(`Invoice ${invoice.invoiceNumber} updated`);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Receipt className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-mono font-medium text-accent">{invoice.invoiceNumber}</p>
            <p className="text-sm text-muted-foreground">{invoice.jobCard}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium text-foreground">{invoice.customer}</p>
          <p className="text-xs text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Form - only labour amount */}
      <div className="max-w-xs">
        <label className="text-sm font-medium text-muted-foreground mb-1 block">Labour Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={labourAmount}
          onChange={(e) => setLabourAmount(e.target.value)}
          className="input-field w-full"
        />
      </div>

      {/* Summary & Submit */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">Tax ({taxRate}%): <span className="text-foreground font-medium">{formatCurrency(tax)}</span></span>
          <span className="text-muted-foreground">Total: <span className="text-foreground font-bold">{formatCurrency(total)}</span></span>
        </div>
        <button onClick={handleSubmit} className="btn-primary text-sm px-4 py-2">
          <Save className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  );
};
