import React, { useMemo } from 'react';
import { Car, ClipboardList, Receipt, ArrowRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/StatCard';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { useSettings } from '@/context/SettingsContext';
import { useInvoices, useMyVehicles, useUserJobCards } from '@/hooks/use-api';

const toStatus = (status: string): StatusType => {
  if (status === 'IN_SERVICE' || status === 'WAITING_FOR_PART') return 'in-progress';
  if (status === 'COMPLETED') return 'completed';
  if (status === 'DELIVERED') return 'completed';
  return 'pending';
};

export const UserDashboard: React.FC = () => {
  const { formatCurrency } = useSettings();
  const { data: vehiclesData } = useMyVehicles();
  const { data: jobCardsData } = useUserJobCards();
  const { data: invoicesData } = useInvoices();

  const totalInvoiceAmount = useMemo(
    () => (invoicesData ?? []).reduce((sum, inv) => sum + (inv.totalBill ?? 0), 0),
    [invoicesData]
  );

  const activeServices = useMemo(
    () =>
      (jobCardsData ?? [])
        .filter((job) => (job.jobStatus ?? job.JobStatus) !== 'DELIVERED')
        .slice(0, 5)
        .map((job) => ({
          id: `JC-${job.id}`,
          vehicle: job.vehicleNumber
            ? `${job.vehicleBrand ?? 'Vehicle'} ${job.vehicleModel ?? ''} (${job.vehicleNumber})`.trim()
            : `Vehicle #${job.vehicle_id ?? job.Vehicle_id ?? 'N/A'}`,
          service: `Spare Parts: ${(job.sparePart_id ?? job.SparePart_id)?.length ?? 0}`,
          status: toStatus(job.jobStatus ?? job.JobStatus ?? 'ARRIVED'),
        })),
    [jobCardsData]
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome! Here's a summary of your vehicles and services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Vehicles" value={String((vehiclesData ?? []).length)} icon={Car} />
        <StatCard title="Active Services" value={String(activeServices.length)} icon={ClipboardList} />
        <StatCard title="Total Invoices" value={String((invoicesData ?? []).length)} icon={Receipt} />
        <StatCard title="Invoice Amount" value={formatCurrency(totalInvoiceAmount)} icon={Receipt} />
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Active Services</h2>
          <Link to="/track-service" className="text-sm text-accent hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {activeServices.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">No active services found.</div>
          )}
          {activeServices.map((svc) => (
            <div key={svc.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{svc.id} - {svc.service}</p>
                  <p className="text-sm text-muted-foreground">{svc.vehicle}</p>
                </div>
              </div>
              <StatusBadge status={svc.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
