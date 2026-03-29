import React from 'react';
import { Car, ClipboardList, Receipt, ArrowRight, CheckCircle, Clock, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/StatCard';
import { StatusBadge, StatusType } from '@/components/StatusBadge';

const activeServices = [
  { id: 'JC-1042', vehicle: 'Toyota Camry 2022', service: 'Full Service', status: 'in-progress' as StatusType },
  { id: 'JC-1045', vehicle: 'Toyota Camry 2022', service: 'AC Repair', status: 'pending' as StatusType },
];

export const UserDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome! Here's a summary of your vehicles and services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="My Vehicles" value="2" icon={Car} />
        <StatCard title="Active Services" value="2" icon={ClipboardList} />
        <StatCard title="Total Invoices" value="4" icon={Receipt} />
      </div>

      {/* Active Services */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Active Services</h2>
          <Link to="/track-service" className="text-sm text-accent hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
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
