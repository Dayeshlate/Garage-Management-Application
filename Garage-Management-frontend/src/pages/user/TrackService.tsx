import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { ServiceProgressTracker } from '@/components/ServiceProgressTracker';
import { useUserJobCards } from '@/hooks/use-api';
import { useSettings } from '@/context/SettingsContext';

const toStatus = (status: string): StatusType => {
  if (status === 'IN_SERVICE' || status === 'WAITING_FOR_PART') return 'in-progress';
  if (status === 'COMPLETED') return 'completed';
  if (status === 'DELIVERED') return 'completed';
  return 'pending';
};

const buildSteps = (status: string) => {
  const pending = [
    { label: 'Vehicle Received', done: false, active: true },
    { label: 'Inspection', done: false },
    { label: 'Service In Progress', done: false },
    { label: 'Quality Check', done: false },
    { label: 'Ready for Pickup', done: false },
  ];
  const inProgress = [
    { label: 'Vehicle Received', done: true },
    { label: 'Inspection', done: true },
    { label: 'Service In Progress', done: false, active: true },
    { label: 'Quality Check', done: false },
    { label: 'Ready for Pickup', done: false },
  ];
  const completed = [
    { label: 'Vehicle Received', done: true },
    { label: 'Inspection', done: true },
    { label: 'Service In Progress', done: true },
    { label: 'Quality Check', done: true },
    { label: 'Ready for Pickup', done: true },
  ];

  if (status === 'COMPLETED') return completed;
  if (status === 'IN_SERVICE' || status === 'WAITING_FOR_PART') return inProgress;
  return pending;
};

export const TrackService: React.FC = () => {
  const { formatCurrency } = useSettings();
  const { data, isLoading, error } = useUserJobCards();

  const myServices = (data ?? []).map((job) => {
    const constSparePartNames = job.sparePartNames ?? [];
    const constSparePartCount = (job.sparePart_id ?? job.SparePart_id)?.length ?? 0;

    return {
      id: `JC-${job.id}`,
      vehicle: job.vehicleNumber
        ? `${job.vehicleBrand ?? 'Vehicle'} ${job.vehicleModel ?? ''}`.trim()
        : `Vehicle #${job.vehicle_id ?? job.Vehicle_id ?? 'N/A'}`,
      plateNo: job.vehicleNumber ?? '-',
      service: constSparePartNames.length > 0
        ? `Spare Parts: ${constSparePartNames.join(', ')}`
        : `Spare Parts: ${constSparePartCount}`,
      status: toStatus(job.jobStatus ?? job.JobStatus ?? 'ARRIVED'),
      mechanicCharge: job.mechanicCharge ?? 0,
      estimatedDate: new Date().toISOString().split('T')[0],
      steps: buildSteps(job.jobStatus ?? job.JobStatus ?? 'ARRIVED'),
    };
  });

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Track My Services</h1>
          <p className="text-muted-foreground mt-1">Monitor the progress of your vehicle services.</p>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading services...</p>}
      {error && <p className="text-sm text-destructive">Failed to load service status from database.</p>}

      <div className="space-y-4">
        {myServices.map((service) => (
          <div key={service.id} className="bg-card rounded-xl border border-border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{service.id}</h3>
                  <StatusBadge status={service.status} />
                </div>
                <p className="text-muted-foreground">
                  {service.vehicle} • {service.plateNo}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Service: <span className="text-foreground font-medium">{service.service}</span>
                </p>
              </div>
              <div className="text-right space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Completion</p>
                  <p className="text-foreground font-medium">{service.estimatedDate}</p>
                </div>
                {service.mechanicCharge > 0 && (
                  <div className="flex items-center gap-1 justify-end">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mechanic Amount</p>
                      <p className="text-foreground font-medium">{formatCurrency(service.mechanicCharge)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <ServiceProgressTracker steps={service.steps} status={service.status} />
          </div>
        ))}
      </div>
    </div>
  );
};
