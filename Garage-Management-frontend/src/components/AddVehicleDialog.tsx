import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateVehicleDto } from '@/api/vehicles';

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (vehicle: CreateVehicleDto) => void;
}

export const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({ open, onOpenChange, onAdd }) => {
  const [form, setForm] = useState({
    vehicleNumber: '',
    serviceType: 'GENERAL_SERVICE',
    brand: '',
    model: '',
    problemDescription: '',
    solutionDescription: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    userEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      vehicleNumber: form.vehicleNumber,
      serviceType: form.serviceType,
      brand: form.brand,
      model: form.model,
      problemDescription: form.problemDescription,
      solutionDescription: form.solutionDescription,
      ownerName: form.ownerName,
      ownerPhone: form.ownerPhone,
      ownerEmail: form.ownerEmail,
      userEmail: form.userEmail,
    });

    setForm({
      vehicleNumber: '',
      serviceType: 'GENERAL_SERVICE',
      brand: '',
      model: '',
      problemDescription: '',
      solutionDescription: '',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      userEmail: '',
    });
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
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" placeholder="e.g. Toyota" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="e.g. Camry" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input id="vehicleNumber" placeholder="e.g. ABC-1234" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <select
                id="serviceType"
                value={form.serviceType}
                onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="GENERAL_SERVICE">GENERAL_SERVICE</option>
                <option value="REPAIR">REPAIR</option>
                <option value="BODY_WORK">BODY_WORK</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="AC_SERVICE">AC_SERVICE</option>
                <option value="WASHING">WASHING</option>
              </select>
            </div>
          </div>



          <div className="space-y-2">
            <Label htmlFor="problemDescription">Problem Description</Label>
            <Input
              id="problemDescription"
              placeholder="Minimum 10 characters"
              value={form.problemDescription}
              onChange={(e) => setForm({ ...form, problemDescription: e.target.value })}
              required
              minLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solutionDescription">Solution Description (Optional)</Label>
            <Input
              id="solutionDescription"
              placeholder="Enter solution description"
              value={form.solutionDescription}
              onChange={(e) => setForm({ ...form, solutionDescription: e.target.value })}
            />
          </div>



          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input id="ownerName" placeholder="Owner name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Owner Phone</Label>
              <Input id="ownerPhone" type="tel" placeholder="+1-800-000-0000" value={form.ownerPhone} onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input id="ownerEmail" type="email" placeholder="owner@example.com" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">User Email</Label>
              <Input id="userEmail" type="email" placeholder="user@example.com" value={form.userEmail} onChange={(e) => setForm({ ...form, userEmail: e.target.value })} />
            </div>
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
