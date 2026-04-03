import React, { useMemo } from 'react';
import {
  Users,
  Car,
  ClipboardList,
  DollarSign,
  ArrowRight,
  Clock,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/StatCard';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { useSettings } from '@/context/SettingsContext';
import { useCustomers, useInventory, useInvoices, useJobCards, useVehicles } from '@/hooks/use-api';

const toStatus = (status: string): StatusType => {
  if (status === 'IN_SERVICE' || status === 'WAITING_FOR_PART') return 'in-progress';
  if (status === 'COMPLETED') return 'completed';
  if (status === 'DELIVERED') return 'completed';
  return 'pending';
};

export const Dashboard: React.FC = () => {
  const { formatCurrency } = useSettings();
  const { data: customers = [] } = useCustomers();
  const { data: jobCards = [] } = useJobCards();
  const { data: vehicles = [] } = useVehicles();
  const { data: invoices = [] } = useInvoices();
  const { data: inventory = [] } = useInventory();

  const activeJobs = jobCards.filter((job) => (job.jobStatus ?? job.JobStatus) !== 'DELIVERED');
  const revenueMtd = invoices
    .filter((bill) => bill.billStatus === 'PAID')
    .reduce((sum, bill) => sum + (bill.totalBill ?? 0), 0);

  const recentJobs = useMemo(
    () =>
      jobCards.slice(0, 6).map((job) => ({
        id: `JC-${job.id}`,
        customer: job.ownerName ?? `Customer #${job.vehicle_id ?? job.Vehicle_id ?? 'N/A'}`,
        vehicle: job.vehicleNumber
          ? `${job.vehicleBrand ?? 'Vehicle'} ${job.vehicleModel ?? ''} (${job.vehicleNumber})`.trim()
          : `Vehicle #${job.vehicle_id ?? job.Vehicle_id ?? 'N/A'}`,
        service: `Spare Parts: ${(job.sparePart_id ?? job.SparePart_id)?.length ?? 0}`,
        status: toStatus(job.jobStatus ?? job.JobStatus ?? 'ARRIVED'),
      })),
    [jobCards]
  );

  const lowStockItems = useMemo(
    () => inventory.filter((item) => (item.partStock ?? 0) <= 5).slice(0, 6),
    [inventory]
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/job-cards" className="btn-primary">
          <ClipboardList className="h-4 w-4" />
          Job Cards
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Customers" value={String(customers.length)} icon={Users} />
        <StatCard title="Active Jobs" value={String(activeJobs.length)} icon={ClipboardList} />
        <StatCard title="Vehicles" value={String(vehicles.length)} icon={Car} />
        <StatCard title="Revenue" value={formatCurrency(revenueMtd)} icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Job Cards</h2>
            <Link to="/job-cards" className="text-sm text-accent hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentJobs.length === 0 && <div className="p-4 text-sm text-muted-foreground">No job cards found.</div>}
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base truncate">{job.id} - {job.service}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{job.customer} • {job.vehicle}</p>
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Low Stock Alert</h2>
            </div>
            <Link to="/inventory" className="text-sm text-accent hover:underline">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-border">
            {lowStockItems.length === 0 && <div className="p-4 text-sm text-muted-foreground">No low stock items.</div>}
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base truncate">{item.partName}</p>
                  <p className="text-xs sm:text-sm text-destructive">
                    Only {item.partStock} pcs left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
