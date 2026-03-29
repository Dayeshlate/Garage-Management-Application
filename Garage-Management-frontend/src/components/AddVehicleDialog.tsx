import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin: string;
    color: string;
    owner: string;
  }) => void;
}

export const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({ open, onOpenChange, onAdd }) => {
  const [form, setForm] = useState({
    make: '', model: '', year: '', licensePlate: '', vin: '', color: '', owner: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...form, year: parseInt(form.year) || new Date().getFullYear() });
    setForm({ make: '', model: '', year: '', licensePlate: '', vin: '', color: '', owner: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input id="make" placeholder="e.g. Toyota" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="e.g. Camry" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" placeholder="e.g. 2023" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" placeholder="e.g. Silver" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input id="licensePlate" placeholder="e.g. ABC-1234" value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input id="vin" placeholder="Vehicle Identification Number" value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input id="owner" placeholder="Owner name" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add Vehicle</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
