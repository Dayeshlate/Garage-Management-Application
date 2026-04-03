import React, { useMemo, useState } from 'react';
import { Car, Calendar, Wrench, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { AddVehicleDialog } from '@/components/AddVehicleDialog';
import { toast } from '@/hooks/use-toast';
import { useCreateVehicle, useMyVehicles } from '@/hooks/use-api';
import type { CreateVehicleDto } from '@/api/vehicles';

interface UserVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  owner: string;
  lastService: string;
  totalServices: number;
  status: 'pending' | 'approved' | 'rejected';
}

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
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data, isLoading, error, refetch } = useMyVehicles();
  const createVehicle = useCreateVehicle();

  const vehicles: UserVehicle[] = useMemo(
    () =>
      (data ?? [])
      .slice()
      .sort((a, b) => Number(b.id) - Number(a.id))
      .map((vehicle) => ({
        id: String(vehicle.id),
        make: vehicle.brand ?? 'Unknown',
        model: vehicle.model ?? 'Unknown',
        year: Number(String(vehicle.model ?? '').match(/\d{4}/)?.[0]) || new Date().getFullYear(),
        licensePlate: vehicle.vehicleNumber ?? '-',
        color: 'Unknown',
        owner: vehicle.ownerName ?? vehicle.userEmail ?? 'Unknown',
        lastService: vehicle.deliveryTime ?? '',
        totalServices: 0,
        status: vehicle.vehicleStatus === 'PENDING' ? 'pending' : 'approved',
      })),
    [data]
  );

  const handleAddVehicle = async (vehicle: CreateVehicleDto) => {
    try {
      await createVehicle.mutateAsync(vehicle);
      await refetch();
      toast({
        title: 'Vehicle submitted for approval',
        description: `${vehicle.brand} ${vehicle.model} has been submitted.`,
      });
    } catch {
      toast({
        title: 'Failed to submit vehicle',
        description: 'Could not create vehicle in backend.',
        variant: 'destructive',
      });
    }
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

      {isLoading && <p className="text-sm text-muted-foreground">Loading your vehicles...</p>}
      {error && <p className="text-sm text-destructive">Failed to load vehicles from database.</p>}

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
              {vehicle.status === 'approved' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Service</p>
                      <p className="text-sm font-medium text-foreground">
                        {vehicle.lastService ? new Date(vehicle.lastService).toLocaleDateString() : 'N/A'}
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
          </div>
        ))}
      </div>

      <AddVehicleDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddVehicle} />
    </div>
  );
};
