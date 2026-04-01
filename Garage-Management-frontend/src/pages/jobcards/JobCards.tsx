import React, { useMemo, useState } from 'react';
import { Search, Filter, Clock, DollarSign, Eye } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { JobCardDetailPanel, type JobCardDetail } from '@/components/JobCardDetailPanel';
import { useJobCards, useUpdateJobCard } from '@/hooks/use-api';
import { useInventory } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';

interface JobCard {
  id: string;
  jobNumber: string;
  customer: string;
  vehicle: string;
  services: string[];
  status: StatusType;
  estimatedCost: number;
  mechanicCharge?: number;
  assignedTo: string;
  createdAt: string;
  dueDate: string;
  sparePartIds?: number[];
  sparePartNames?: string[];
  spareParts?: { id: string; name: string; price: number; qty: number }[];
}

const mapStatus = (status: string): StatusType => {
  if (status === 'ARRIVED') return 'pending';
  if (status === 'IN_SERVICE' || status === 'WAITING_FOR_PART') return 'in-progress';
  if (status === 'COMPLETED') return 'completed';
  if (status === 'DELIVERED') return 'completed';
  return 'pending';
};

export const JobCards: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all');
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
  const updateJobCard = useUpdateJobCard();

  const { data, isLoading, error, refetch } = useJobCards();
  const { data: inventoryData = [] } = useInventory();

  const inventoryById = useMemo(
    () =>
      Object.fromEntries(
        inventoryData.map((item) => [
          Number(item.id),
          { name: item.partName, price: item.partPrice },
        ])
      ),
    [inventoryData]
  );

  const handleStatusChange = async (jobId: string, newStatus: StatusType) => {
    const previousStatus = selectedJob?.id === jobId ? selectedJob.status : null;
    setSelectedJob((prev) => (prev && prev.id === jobId ? { ...prev, status: newStatus } : prev));

    try {
      const statusMap: { [key in StatusType]: string } = {
        'pending': 'ARRIVED',
        'in-progress': 'IN_SERVICE',
        'completed': 'COMPLETED',
        'cancelled': 'DELIVERED',
      };
      
      await updateJobCard.mutateAsync({
        id: Number(jobId),
        data: { jobStatus: statusMap[newStatus] as any },
      });

      await refetch();

      toast({ title: 'Status updated', description: `Job card status changed to ${newStatus}` });
    } catch (error) {
      if (previousStatus) {
        setSelectedJob((prev) => (prev && prev.id === jobId ? { ...prev, status: previousStatus } : prev));
      }
      toast({ title: 'Failed to update status', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const handleUpdateSteps = () => {
    toast({ title: 'Steps updated', description: 'Service progress saved.' });
  };

  const handleUpdateParts = async (jobId: string, parts: { id: string; name: string; price: number; qty: number }[]) => {
    const partIds = Array.from(new Set(parts.map((p) => Number(p.id)).filter((id) => Number.isFinite(id))));

    try {
      await updateJobCard.mutateAsync({
        id: Number(jobId),
        data: { sparePart_id: partIds, SparePart_id: partIds },
      });
      setSelectedJob((prev) =>
        prev && prev.id === jobId
          ? {
              ...prev,
              sparePartIds: partIds,
              sparePartNames: parts.map((p) => p.name),
              spareParts: parts,
              services: parts.length > 0 ? parts.map((p) => p.name) : ['No spare parts'],
            }
          : prev
      );
      await refetch();
      toast({ title: 'Parts updated', description: 'Spare parts saved to this job card.' });
    } catch {
      toast({ title: 'Failed to update parts', description: 'Could not save spare parts to backend.', variant: 'destructive' });
    }
  };

  const handleUpdateDueDate = (jobId: string, dueDate: string) => {
    toast({ title: 'Due date updated', description: `Due date changed to ${new Date(dueDate).toLocaleDateString()}` });
  };

  const handleUpdateMechanicCharge = async (jobId: string, charge: number) => {
    try {
      await updateJobCard.mutateAsync({
        id: Number(jobId),
        data: { mechanicCharge: charge },
      });
      toast({ title: 'Mechanic amount updated', description: `Mechanic amount set to ${charge}` });
    } catch (error) {
      toast({ title: 'Failed to update mechanic amount', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const jobCards: JobCard[] = useMemo(
    () =>
      (data ?? []).map((job) => {
        const constPartIds = (job.sparePart_id ?? job.SparePart_id ?? []).map((id) => Number(id));
        const constPartNames = job.sparePartNames ?? constPartIds.map((id) => inventoryById[id]?.name ?? `Part #${id}`);
        const constParts = constPartIds.map((id) => ({
          id: String(id),
          name: inventoryById[id]?.name ?? `Part #${id}`,
          price: inventoryById[id]?.price ?? 0,
          qty: 1,
        }));
        return {
          id: String(job.id),
          jobNumber: `JC-${job.id}`,
          customer: job.ownerName || `Customer #${job.vehicle_id ?? job.Vehicle_id ?? 'N/A'}`,
          vehicle: `${job.vehicleBrand || 'N/A'} ${job.vehicleModel || 'N/A'} (${job.vehicleNumber || 'N/A'})`,
          services: constPartNames.length > 0 ? constPartNames : ['No spare parts'],
          status: mapStatus(job.jobStatus ?? job.JobStatus ?? 'ARRIVED'),
          estimatedCost: 0,
          mechanicCharge: job.mechanicCharge,
          assignedTo: job.ownerPhone || 'N/A',
          createdAt: new Date().toISOString().split('T')[0],
          dueDate: new Date().toISOString().split('T')[0],
          sparePartIds: constPartIds,
          sparePartNames: constPartNames,
          spareParts: constParts,
        };
      }),
    [data, inventoryById]
  );

  const filteredJobCards = jobCards.filter((job) => {
    const matchesSearch =
      job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: jobCards.length,
    pending: jobCards.filter((j) => j.status === 'pending').length,
    'in-progress': jobCards.filter((j) => j.status === 'in-progress').length,
    completed: jobCards.filter((j) => j.status === 'completed').length,
    cancelled: jobCards.filter((j) => j.status === 'cancelled').length,
  };

  const columns = [
    {
      key: 'jobNumber',
      header: 'Job #',
      render: (job: JobCard) => (
        <span className="font-mono font-medium text-accent">{job.jobNumber}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer & Vehicle',
      render: (job: JobCard) => (
        <div>
          <p className="font-medium text-foreground">{job.customer}</p>
          <p className="text-sm text-muted-foreground">{job.vehicle}</p>
        </div>
      ),
    },
    {
      key: 'services',
      header: 'Services',
      render: (job: JobCard) => (
        <div className="flex flex-wrap gap-1">
          {job.services.map((service, index) => (
            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs">
              {service}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (job: JobCard) => <StatusBadge status={job.status} />,
    },
    {
      key: 'estimatedCost',
      header: 'Est. Cost',
      render: (job: JobCard) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{job.estimatedCost}</span>
        </div>
      ),
    },
    {
    key: 'dueDate',
    header: 'Due Date',
    render: (job: JobCard) => (
    <div className="flex items-center gap-2 text-sm">
      <Clock className="h-4 w-4 text-muted-foreground" />
      {new Date(job.dueDate).toLocaleDateString()}
    </div>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: (job: JobCard) => (
    <button
      onClick={() => setSelectedJob(job)}
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
          <h1 className="page-title">Job Cards</h1>
          <p className="text-muted-foreground mt-1">Manage service job cards and work orders</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'in-progress', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            <span className="ml-2 text-xs opacity-70">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search job cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary" disabled>
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading job cards...</p>}
      {error && <p className="text-sm text-destructive">Failed to load job cards from database.</p>}

      <DataTable
        columns={columns}
        data={filteredJobCards}
        emptyMessage="No job cards found"
      />

      {selectedJob && (
        <JobCardDetailPanel
          job={selectedJob as JobCardDetail}
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdateSteps={handleUpdateSteps}
          onUpdateParts={handleUpdateParts}
          onStatusChange={handleStatusChange}
          onUpdateDueDate={handleUpdateDueDate}
          onUpdateMechanicCharge={handleUpdateMechanicCharge}
        />
      )}
    </div>
  );
};
