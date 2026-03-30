import React, { useMemo, useState } from 'react';
import { Plus, Search, Car, Calendar, MoreVertical, Eye, Clock } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { AddVehicleDialog } from '@/components/AddVehicleDialog';
import { VehicleDetailPanel } from '@/components/VehicleDetailPanel';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCreateVehicle, usePendingVehicles, useVehicles } from '@/hooks/use-api';
import type { CreateVehicleDto } from '@/api/vehicles';
import { vehiclesApi } from '@/api/vehicles';

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

export const Vehicles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);

  const { data: allVehiclesData, isLoading: isLoadingVehicles, error: vehiclesError, refetch: refetchVehicles } = useVehicles();
  const { data: pendingVehiclesData, isLoading: isLoadingPending, error: pendingError, refetch: refetchPending } = usePendingVehicles();
  const createVehicle = useCreateVehicle();

  const mapVehicle = (vehicle: any): Vehicle => {
    const modelText = vehicle?.model ?? '';
    const yearCandidate = Number(String(modelText).match(/\d{4}/)?.[0]);
    const year = Number.isFinite(yearCandidate) ? yearCandidate : new Date().getFullYear();
    const status = vehicle?.vehicleStatus === 'PENDING' ? 'pending' : 'approved';

    return {
      id: String(vehicle?.id),
      make: vehicle?.brand ?? 'Unknown',
      model: modelText || 'Unknown',
      year,
      licensePlate: vehicle?.vehicleNumber ?? '-',
      vin: vehicle?.vehicleType ?? '-',
      color: 'Unknown',
      owner: vehicle?.ownerName ?? vehicle?.userEmail ?? 'Unknown',
      ownerEmail: vehicle?.ownerEmail ?? vehicle?.userEmail,
      ownerPhone: vehicle?.ownerPhone ?? '',
      lastService: vehicle?.deliveryTime ?? vehicle?.expectedTime ?? vehicle?.arrivalTime ?? '',
      totalServices: 0,
      status,
      submittedAt: vehicle?.arrivalTime ?? '',
    };
  };

  const vehicles = useMemo(() => (allVehiclesData ?? []).map(mapVehicle).filter((v) => v.status !== 'pending'), [allVehiclesData]);
  const pendingVehicles = useMemo(() => (pendingVehiclesData ?? []).map(mapVehicle), [pendingVehiclesData]);

  const handleAddVehicle = async (vehicle: CreateVehicleDto) => {
    try {
      await createVehicle.mutateAsync(vehicle);
      await Promise.all([refetchVehicles(), refetchPending()]);
      toast({ title: 'Vehicle added', description: `${vehicle.brand} ${vehicle.model} has been added.` });
    } catch (error) {
      toast({ title: 'Failed to add vehicle', description: 'Please verify backend vehicle fields and try again.', variant: 'destructive' });
    }
  };

  const handleUpdateVehicle = (id: string, updates: Partial<Vehicle>) => {
    if (viewVehicle?.id === id) {
      setViewVehicle((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  const handleApproveVehicle = async (id: string) => {
    try {
      setIsLoadingApproval(true);
      await vehiclesApi.approve(Number(id));
      toast({ title: 'Vehicle approved', description: 'Vehicle has been approved successfully.' });
      setViewVehicle(null);
      await Promise.all([refetchVehicles(), refetchPending()]);
    } catch (error) {
      toast({ title: 'Failed to approve vehicle', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoadingApproval(false);
    }
  };

  const handleRejectVehicle = async (id: string) => {
    try {
      setIsLoadingApproval(true);
      await vehiclesApi.reject(Number(id));
      toast({ title: 'Vehicle rejected', description: 'Vehicle has been rejected successfully.' });
      setViewVehicle(null);
      await Promise.all([refetchVehicles(), refetchPending()]);
    } catch (error) {
      toast({ title: 'Failed to reject vehicle', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoadingApproval(false);
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPending = pendingVehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approvedColumns = [
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Car className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-sm text-muted-foreground">{vehicle.color}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'licensePlate',
      header: 'License Plate',
      render: (vehicle: Vehicle) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted font-mono text-sm font-medium">
          {vehicle.licensePlate}
        </span>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (vehicle: Vehicle) => <span className="text-foreground">{vehicle.owner}</span>,
    },
    {
      key: 'lastService',
      header: 'Last Service',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {vehicle.lastService ? new Date(vehicle.lastService).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      key: 'totalServices',
      header: 'Total Services',
      render: (vehicle: Vehicle) => <span className="font-medium text-foreground">{vehicle.totalServices}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (vehicle: Vehicle) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewVehicle(vehicle)}>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const pendingColumns = [
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
            <Car className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-sm text-muted-foreground">{vehicle.color}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'licensePlate',
      header: 'License Plate',
      render: (vehicle: Vehicle) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted font-mono text-sm font-medium">
          {vehicle.licensePlate}
        </span>
      ),
    },
    {
      key: 'owner',
      header: 'Submitted By',
      render: (vehicle: Vehicle) => (
        <div>
          <p className="text-foreground font-medium">{vehicle.owner}</p>
          {vehicle.ownerEmail && <p className="text-xs text-muted-foreground">{vehicle.ownerEmail}</p>}
        </div>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {vehicle.submittedAt ? new Date(vehicle.submittedAt).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (vehicle: Vehicle) => (
        <button
          onClick={() => setViewVehicle(vehicle)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4 text-muted-foreground" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage registered vehicles and approve user submissions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by make, model, plate, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {(isLoadingVehicles || isLoadingPending) && <p className="text-sm text-muted-foreground">Loading vehicles...</p>}
      {(vehiclesError || pendingError) && <p className="text-sm text-destructive">Failed to load vehicles from database.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Approved Vehicles</p>
          <p className="text-2xl font-bold text-foreground mt-1">{vehicles.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-yellow-500/30">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingVehicles.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Services</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {vehicles.reduce((sum, v) => sum + v.totalServices, 0)}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold text-foreground mt-1">{vehicles.length + pendingVehicles.length}</p>
        </div>
      </div>

      <Tabs defaultValue="approved" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approved">
            Approved ({vehicles.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending ({pendingVehicles.length})
            {pendingVehicles.length > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white">
                {pendingVehicles.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved">
          <DataTable columns={approvedColumns} data={filteredVehicles} emptyMessage="No approved vehicles found" />
        </TabsContent>

        <TabsContent value="pending">
          <DataTable columns={pendingColumns} data={filteredPending} emptyMessage="No pending vehicles to review" />
        </TabsContent>
      </Tabs>

      <AddVehicleDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddVehicle} />

      {viewVehicle && (
        <VehicleDetailPanel
          vehicle={viewVehicle}
          open={!!viewVehicle}
          onClose={() => setViewVehicle(null)}
          onUpdate={handleUpdateVehicle}
          isAdmin={true}
          onApprove={handleApproveVehicle}
          onReject={handleRejectVehicle}
          isLoadingApproval={isLoadingApproval}
        />
      )}
    </div>
  );
};
