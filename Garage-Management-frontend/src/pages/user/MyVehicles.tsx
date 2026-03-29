import React, { useState } from 'react';
import { Car, Calendar, Wrench, Fuel, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { AddVehicleDialog } from '@/components/AddVehicleDialog';
import { toast } from '@/hooks/use-toast';

interface UserVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  owner: string;
  lastService: string;
  totalServices: number;
  status: 'pending' | 'approved' | 'rejected';
}

const mockUserVehicles: UserVehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    licensePlate: 'KA-01-AB-1234',
    vin: '1HGBH41JXMN109186',
    color: 'Silver',
    owner: 'John Smith',
    lastService: '2026-01-15',
    totalServices: 5,
    status: 'approved',
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    licensePlate: 'KA-01-CD-5678',
    vin: '2HGBH41JXMN109187',
    color: 'White',
    owner: 'John Smith',
    lastService: '2026-02-03',
    totalServices: 3,
    status: 'approved',
  },
  {
    id: '3',
    make: 'BMW',
    model: 'X3',
    year: 2023,
    licensePlate: 'KA-02-EF-9012',
    vin: '3HGBH41JXMN109188',
    color: 'Black',
    owner: 'John Smith',
    lastService: '',
    totalServices: 0,
    status: 'pending',
  },
];

const statusIcon = {
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  approved: <CheckCircle className="h-4 w-4 text-green-500" />,
  rejected: <XCircle className="h-4 w-4 text-red-500" />,
};

const statusLabel = {
  pending: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const MyVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState(mockUserVehicles);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddVehicle = (vehicle: { make: string; model: string; year: number; licensePlate: string; vin: string; color: string; owner: string }) => {
    const newVehicle: UserVehicle = {
      ...vehicle,
      id: String(Date.now()),
      lastService: '',
      totalServices: 0,
      status: 'pending',
    };
    setVehicles([newVehicle, ...vehicles]);
    toast({
      title: 'Vehicle submitted for approval',
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been submitted. Admin will review it shortly.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Vehicles</h1>
          <p className="text-muted-foreground mt-1">View your registered vehicles and add new ones.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Vehicles</p>
          <p className="text-2xl font-bold text-foreground mt-1">{vehicles.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {vehicles.filter(v => v.status === 'approved').length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {vehicles.filter(v => v.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`bg-card rounded-xl border p-6 ${
              vehicle.status === 'pending'
                ? 'border-yellow-500/30'
                : vehicle.status === 'rejected'
                ? 'border-destructive/30'
                : 'border-border'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Car className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {vehicle.make} {vehicle.model} {vehicle.year}
                  </h3>
                  <p className="text-sm font-mono text-muted-foreground">{vehicle.licensePlate}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {statusIcon[vehicle.status]}
                <span className={
                  vehicle.status === 'pending'
                    ? 'text-yellow-600'
                    : vehicle.status === 'rejected'
                    ? 'text-destructive'
                    : 'text-green-600'
                }>
                  {statusLabel[vehicle.status]}
                </span>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <div
                    className="h-4 w-4 rounded-full border border-border"
                    style={{
                      backgroundColor:
                        vehicle.color.toLowerCase() === 'white'
                          ? '#e5e7eb'
                          : vehicle.color.toLowerCase(),
                    }}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Color</p>
                  <p className="text-sm font-medium text-foreground">{vehicle.color}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <Car className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">VIN</p>
                  <p className="text-sm font-medium text-foreground truncate max-w-[120px]">{vehicle.vin}</p>
                </div>
              </div>
              {vehicle.status === 'approved' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Service</p>
                      <p className="text-sm font-medium text-foreground">
                        {vehicle.lastService || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Services</p>
                      <p className="text-sm font-medium text-foreground">{vehicle.totalServices}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {vehicle.status === 'pending' && (
              <div className="mt-4 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                <p className="text-xs text-muted-foreground">
                  This vehicle is awaiting admin verification. You'll be able to book services once it's approved.
                </p>
              </div>
            )}
            {vehicle.status === 'rejected' && (
              <div className="mt-4 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <p className="text-xs text-destructive">
                  This vehicle was rejected by admin. Please contact support for more information.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <AddVehicleDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddVehicle} />
    </div>
  );
};
