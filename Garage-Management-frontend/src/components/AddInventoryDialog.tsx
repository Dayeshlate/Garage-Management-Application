import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: {
    name: string;
    sku: string;
    category: string;
    quantity: number;
    unit: string;
    minStock: number;
    unitPrice: number;
    supplier: string;
  }) => void;
}

export const AddInventoryDialog: React.FC<AddInventoryDialogProps> = ({ open, onOpenChange, onAdd }) => {
  const [form, setForm] = useState({
    name: '', sku: '', category: '', quantity: '', unit: '', minStock: '', unitPrice: '', supplier: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...form,
      quantity: parseInt(form.quantity) || 0,
      minStock: parseInt(form.minStock) || 0,
      unitPrice: parseFloat(form.unitPrice) || 0,
    });
    setForm({ name: '', sku: '', category: '', quantity: '', unit: '', minStock: '', unitPrice: '', supplier: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inv-name">Item Name</Label>
              <Input id="inv-name" placeholder="e.g. Engine Oil 5W-30" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-sku">SKU</Label>
              <Input id="inv-sku" placeholder="e.g. OIL-5W30-01" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inv-category">Category</Label>
              <Input id="inv-category" placeholder="e.g. Lubricants" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-supplier">Supplier</Label>
              <Input id="inv-supplier" placeholder="Supplier name" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inv-qty">Quantity</Label>
              <Input id="inv-qty" type="number" placeholder="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-unit">Unit</Label>
              <Input id="inv-unit" placeholder="e.g. Liters" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-min">Min Stock</Label>
              <Input id="inv-min" type="number" placeholder="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-price">Unit Price</Label>
            <Input id="inv-price" type="number" step="0.01" placeholder="0.00" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
