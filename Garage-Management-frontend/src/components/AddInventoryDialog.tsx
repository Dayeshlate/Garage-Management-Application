import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: {
    partName: string;
    manufacture: string;
    partStock: number;
    partPrice: number;
  }) => void;
}

const partCategories = [
  'Engine',
  'Electrical',
  'Body',
  'Tyre',
  'AC',
  'Brake',
  'Suspension',
  'General',
];

export const AddInventoryDialog: React.FC<AddInventoryDialogProps> = ({ open, onOpenChange, onAdd }) => {
  const [form, setForm] = useState({
    partName: '',
    manufacture: 'General',
    partStock: '',
    partPrice: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      partName: form.partName,
      manufacture: form.manufacture,
      partStock: parseInt(form.partStock) || 0,
      partPrice: parseFloat(form.partPrice) || 0,
    });
    setForm({ partName: '', manufacture: 'General', partStock: '', partPrice: '' });
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
              <Label htmlFor="part-name">Part Name</Label>
              <Input id="part-name" placeholder="e.g. Oil Filter" value={form.partName} onChange={(e) => setForm({ ...form, partName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="part-category">Category</Label>
              <select
                id="part-category"
                value={form.manufacture}
                onChange={(e) => setForm({ ...form, manufacture: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {partCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="part-stock">Stock</Label>
            <Input id="part-stock" type="number" placeholder="0" value={form.partStock} onChange={(e) => setForm({ ...form, partStock: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="part-price">Part Price</Label>
            <Input id="part-price" type="number" step="0.01" placeholder="0.00" value={form.partPrice} onChange={(e) => setForm({ ...form, partPrice: e.target.value })} required />
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
