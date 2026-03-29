import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Clock, DollarSign } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { AddJobCardDialog } from '@/components/AddJobCardDialog';
import { JobCardDetailPanel } from '@/components/JobCardDetailPanel';
import { ServiceStep } from '@/components/ServiceProgressTracker';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JobCard {
  id: string;
  jobNumber: string;
  customer: string;
  vehicle: string;
  services: string[];
  status: StatusType;
  estimatedCost: number;
  assignedTo: string;
  createdAt: string;
  dueDate: string;
  spareParts?: { id: string; name: string; price: number; qty: number }[];
  serviceSteps?: ServiceStep[];
}

const defaultSteps = (): ServiceStep[] => [
  { label: 'Vehicle Received', done: false },
  { label: 'Inspection', done: false },
  { label: 'Service In Progress', done: false },
  { label: 'Quality Check', done: false },
  { label: 'Ready for Pickup', done: false },
];

const mockJobCards: JobCard[] = [
  { id: '1', jobNumber: 'JC-2024-001', customer: 'John Smith', vehicle: 'Toyota Camry 2022', services: ['Oil Change', 'Filter Replacement'], status: 'in-progress', estimatedCost: 150, assignedTo: 'Mike Tech', createdAt: '2024-03-18', dueDate: '2024-03-19', serviceSteps: [{ label: 'Vehicle Received', done: true }, { label: 'Inspection', done: true }, { label: 'Service In Progress', done: false, active: true }, { label: 'Quality Check', done: false }, { label: 'Ready for Pickup', done: false }] },
  { id: '2', jobNumber: 'JC-2024-002', customer: 'Sarah Wilson', vehicle: 'Honda Civic 2021', services: ['Brake Repair', 'Pad Replacement'], status: 'pending', estimatedCost: 450, assignedTo: 'John Tech', createdAt: '2024-03-18', dueDate: '2024-03-20', serviceSteps: defaultSteps() },
  { id: '3', jobNumber: 'JC-2024-003', customer: 'Mike Johnson', vehicle: 'Ford F-150 2020', services: ['Engine Tune-up'], status: 'completed', estimatedCost: 280, assignedTo: 'Mike Tech', createdAt: '2024-03-17', dueDate: '2024-03-18', serviceSteps: defaultSteps().map(s => ({ ...s, done: true, active: false })) },
  { id: '4', jobNumber: 'JC-2024-004', customer: 'Emily Davis', vehicle: 'BMW X5 2023', services: ['AC Repair', 'Gas Refill'], status: 'in-progress', estimatedCost: 350, assignedTo: 'Sarah Tech', createdAt: '2024-03-18', dueDate: '2024-03-19', serviceSteps: [{ label: 'Vehicle Received', done: true }, { label: 'Inspection', done: false, active: true }, { label: 'Service In Progress', done: false }, { label: 'Quality Check', done: false }, { label: 'Ready for Pickup', done: false }] },
  { id: '5', jobNumber: 'JC-2024-005', customer: 'Robert Brown', vehicle: 'Audi A4 2021', services: ['Tire Rotation', 'Wheel Alignment'], status: 'completed', estimatedCost: 120, assignedTo: 'John Tech', createdAt: '2024-03-16', dueDate: '2024-03-17', serviceSteps: defaultSteps().map(s => ({ ...s, done: true, active: false })) },
  { id: '6', jobNumber: 'JC-2024-006', customer: 'Lisa Anderson', vehicle: 'Mercedes C-Class 2022', services: ['Full Service'], status: 'pending', estimatedCost: 550, assignedTo: 'Mike Tech', createdAt: '2024-03-18', dueDate: '2024-03-21', serviceSteps: defaultSteps() },
  { id: '7', jobNumber: 'JC-2024-007', customer: 'David Martinez', vehicle: 'Chevrolet Silverado 2020', services: ['Transmission Check'], status: 'cancelled', estimatedCost: 200, assignedTo: 'Sarah Tech', createdAt: '2024-03-15', dueDate: '2024-03-16', serviceSteps: defaultSteps() },
  { id: '8', jobNumber: 'JC-2024-008', customer: 'Jennifer Taylor', vehicle: 'Tesla Model 3 2023', services: ['Battery Check', 'Software Update'], status: 'completed', estimatedCost: 100, assignedTo: 'John Tech', createdAt: '2024-03-17', dueDate: '2024-03-18', serviceSteps: defaultSteps().map(s => ({ ...s, done: true, active: false })) },
];

export const JobCards: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [jobCards, setJobCards] = useState(mockJobCards);
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);

  const handleAddJobCard = (jc: { customer: string; vehicle: string; services: string[]; status: string; estimatedCost: number; assignedTo: string; dueDate: string }) => {
    const newJob: JobCard = {
      id: String(jobCards.length + 1),
      jobNumber: `JC-2024-${String(jobCards.length + 1).padStart(3, '0')}`,
      customer: jc.customer,
      vehicle: jc.vehicle,
      services: jc.services,
      status: jc.status as StatusType,
      estimatedCost: jc.estimatedCost,
      assignedTo: jc.assignedTo,
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: jc.dueDate,
      serviceSteps: defaultSteps(),
      spareParts: [],
    };
    setJobCards([newJob, ...jobCards]);
    toast({ title: 'Job Card created', description: `${newJob.jobNumber} has been created.` });
  };

  const handleUpdateSteps = (jobId: string, steps: ServiceStep[]) => {
    setJobCards((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, serviceSteps: steps } : j))
    );
    if (selectedJob?.id === jobId) {
      setSelectedJob((prev) => prev ? { ...prev, serviceSteps: steps } : prev);
    }
  };

  const handleUpdateParts = (jobId: string, parts: { id: string; name: string; price: number; qty: number }[]) => {
    setJobCards((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, spareParts: parts } : j))
    );
    if (selectedJob?.id === jobId) {
      setSelectedJob((prev) => prev ? { ...prev, spareParts: parts } : prev);
    }
  };

  const handleStatusChange = (jobId: string, status: StatusType) => {
    setJobCards((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
    if (selectedJob?.id === jobId) {
      setSelectedJob((prev) => prev ? { ...prev, status } : prev);
    }
  };

  const handleUpdateDueDate = (jobId: string, dueDate: string) => {
    setJobCards((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, dueDate } : j))
    );
    if (selectedJob?.id === jobId) {
      setSelectedJob((prev) => prev ? { ...prev, dueDate } : prev);
    }
  };

  const handleRowClick = (job: JobCard) => {
    setSelectedJob(job);
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedJob(job)}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Job Card</DropdownMenuItem>
            <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Cancel Job</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        <button className="btn-primary" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          New Job Card
        </button>
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
        <button className="btn-secondary">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredJobCards}
        emptyMessage="No job cards found"
        onRowClick={handleRowClick}
      />

      <AddJobCardDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddJobCard} />

      {selectedJob && (
        <JobCardDetailPanel
          job={selectedJob}
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdateSteps={handleUpdateSteps}
          onUpdateParts={handleUpdateParts}
          onStatusChange={handleStatusChange}
          onUpdateDueDate={handleUpdateDueDate}
        />
      )}
    </div>
  );
};
