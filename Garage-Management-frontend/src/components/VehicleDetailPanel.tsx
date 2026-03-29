import React, { useState, useEffect } from 'react';
import { X, Car, User, Wrench, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  owner: string;
  ownerEmail?: string;
  ownerPhone?: string;
  lastService: string;
  totalServices: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
}

interface VehicleDetailPanelProps {
  vehicle: Vehicle;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Vehicle>) => void;
}

export const VehicleDetailPanel: React.FC<VehicleDetailPanelProps> = ({
  vehicle,
  open,
  onClose,
  onUpdate,
}) => {
  const [editingColor, setEditingColor] = useState(vehicle.color);
  const [editingPhone, setEditingPhone] = useState(vehicle.ownerPhone || '');
  const [editingEmail, setEditingEmail] = useState(vehicle.ownerEmail || '');

  useEffect(() => {
    setEditingColor(vehicle.color);
    setEditingPhone(vehicle.ownerPhone || '');
    setEditingEmail(vehicle.ownerEmail || '');
  }, [vehicle]);

  const handleColorChange = (value: string) => {
    setEditingColor(value);
    onUpdate(vehicle.id, { color: value });
    toast({
      title: 'Color updated',
      description: `Vehicle color changed to ${value}`,
    });
  };

  const handlePhoneChange = () => {
    onUpdate(vehicle.id, { ownerPhone: editingPhone });
    toast({
      title: 'Phone updated',
      description: `Owner phone updated to ${editingPhone}`,
    });
  };

  const handleEmailChange = () => {
    onUpdate(vehicle.id, { ownerEmail: editingEmail });
    toast({
      title: 'Email updated',
      description: `Owner email updated to ${editingEmail}`,
    });
  };

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
              <Car className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-mono text-sm text-muted-foreground">{vehicle.licensePlate}</p>
              <h2 className="text-lg font-bold text-foreground">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Vehicle Details */}
          <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-fade-in">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Car className="h-4 w-4 text-accent" />
              Vehicle Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Make</label>
                <input
                  type="text"
                  value={vehicle.make}
                  disabled
                  className="input-field bg-muted text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Model</label>
                <input
                  type="text"
                  value={vehicle.model}
                  disabled
                  className="input-field bg-muted text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Year</label>
                <input
                  type="number"
                  value={vehicle.year}
                  disabled
                  className="input-field bg-muted text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Color</label>
                <select
                  value={editingColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="input-field"
                >
                  <option value="Blue">Blue</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Red">Red</option>
                  <option value="Silver">Silver</option>
                  <option value="Gray">Gray</option>
                  <option value="Green">Green</option>
                  <option value="Orange">Orange</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">License Plate</label>
              <input
                type="text"
                value={vehicle.licensePlate}
                disabled
                className="input-field bg-muted text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">VIN</label>
              <input
                type="text"
                value={vehicle.vin}
                disabled
                className="input-field bg-muted text-muted-foreground font-mono text-xs"
              />
            </div>
          </div>

          {/* Owner Details */}
          <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-fade-in">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              Owner Information
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Owner Name</label>
              <input
                type="text"
                value={vehicle.owner}
                disabled
                className="input-field bg-muted text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={editingEmail}
                onChange={(e) => setEditingEmail(e.target.value)}
                onBlur={handleEmailChange}
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <input
                type="tel"
                value={editingPhone}
                onChange={(e) => setEditingPhone(e.target.value)}
                onBlur={handlePhoneChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Service History */}
          <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-fade-in">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Wrench className="h-4 w-4 text-accent" />
              Service History
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Services</p>
                <p className="text-2xl font-bold text-accent">{vehicle.totalServices}</p>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">Last Service</p>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {vehicle.lastService ? new Date(vehicle.lastService).toLocaleDateString() : 'Never'}
                </div>
              </div>
            </div>

            <Button className="w-full gap-2" variant="outline">
              <Plus className="h-4 w-4" />
              Schedule Service
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
