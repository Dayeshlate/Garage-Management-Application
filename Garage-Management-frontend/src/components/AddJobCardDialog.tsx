import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddJobCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (jobCard: {
    customer: string;
    vehicle: string;
    services: string[];
    status: string;
    estimatedCost: number;
    assignedTo: string;
    dueDate: string;
  }) => void;
}

export const AddJobCardDialog: React.FC<AddJobCardDialogProps> = ({ open, onOpenChange, onAdd }) => {
  const [form, setForm] = useState({
    customer: '', vehicle: '', services: '', status: 'pending', estimatedCost: '', assignedTo: '', dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...form,
      services: form.services.split(',').map((s) => s.trim()).filter(Boolean),
      estimatedCost: parseFloat(form.estimatedCost) || 0,
    });
    setForm({ customer: '', vehicle: '', services: '', status: 'pending', estimatedCost: '', assignedTo: '', dueDate: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Job Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jc-customer">Customer</Label>
              <Input id="jc-customer" placeholder="Customer name" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jc-vehicle">Vehicle</Label>
              <Input id="jc-vehicle" placeholder="e.g. Toyota Camry 2022" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jc-services">Services (comma-separated)</Label>
            <Input id="jc-services" placeholder="e.g. Oil Change, Brake Repair" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jc-cost">Estimated Cost</Label>
              <Input id="jc-cost" type="number" placeholder="0.00" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jc-assigned">Assigned To</Label>
              <Input id="jc-assigned" placeholder="Technician name" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jc-due">Due Date</Label>
              <Input id="jc-due" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create Job Card</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
