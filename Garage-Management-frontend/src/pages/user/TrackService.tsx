import React from 'react';
import { Clock, CheckCircle, Wrench, AlertCircle } from 'lucide-react';
import { StatusBadge, StatusType } from '@/components/StatusBadge';

const myServices = [
  {
    id: 'JC-1042',
    vehicle: 'Toyota Camry 2022',
    plateNo: 'KA-01-AB-1234',
    service: 'Full Service',
    status: 'in-progress' as StatusType,
    estimatedDate: '2026-02-10',
    steps: [
      { label: 'Vehicle Received', done: true },
      { label: 'Inspection', done: true },
      { label: 'Service In Progress', done: false, active: true },
      { label: 'Quality Check', done: false },
      { label: 'Ready for Pickup', done: false },
    ],
  },
  {
    id: 'JC-1038',
    vehicle: 'Honda Civic 2021',
    plateNo: 'KA-01-CD-5678',
    service: 'Brake Replacement',
    status: 'completed' as StatusType,
    estimatedDate: '2026-02-03',
    steps: [
      { label: 'Vehicle Received', done: true },
      { label: 'Inspection', done: true },
      { label: 'Service In Progress', done: true },
      { label: 'Quality Check', done: true },
      { label: 'Ready for Pickup', done: true },
    ],
  },
  {
    id: 'JC-1045',
    vehicle: 'Toyota Camry 2022',
    plateNo: 'KA-01-AB-1234',
    service: 'AC Repair',
    status: 'pending' as StatusType,
    estimatedDate: '2026-02-15',
    steps: [
      { label: 'Vehicle Received', done: true },
      { label: 'Inspection', done: false, active: true },
      { label: 'Service In Progress', done: false },
      { label: 'Quality Check', done: false },
      { label: 'Ready for Pickup', done: false },
    ],
  },
];

export const TrackService: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Track My Services</h1>
          <p className="text-muted-foreground mt-1">Monitor the progress of your vehicle services.</p>
        </div>
      </div>

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
              <div className="text-sm text-muted-foreground text-right">
                <p>Estimated Completion</p>
                <p className="text-foreground font-medium">{service.estimatedDate}</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-0">
              {service.steps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full mb-2 ${
                      step.done
                        ? 'bg-accent text-accent-foreground'
                        : step.active
                        ? 'bg-accent/20 text-accent border-2 border-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.done ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : step.active ? (
                        <Wrench className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <span className={`text-xs ${step.done || step.active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < service.steps.length - 1 && (
                    <div className={`h-0.5 flex-1 -mt-6 ${step.done ? 'bg-accent' : 'bg-border'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
