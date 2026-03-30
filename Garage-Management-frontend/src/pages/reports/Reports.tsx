import React, { useMemo, useState } from 'react';
import { Download, TrendingUp, Users, DollarSign, Car } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useCustomers, useInvoices, useJobCards, useVehicles } from '@/hooks/use-api';

export const Reports: React.FC = () => {
  const { formatCurrency } = useSettings();
  const [dateRange, setDateRange] = useState('6months');

  const { data: customers = [] } = useCustomers();
  const { data: jobCards = [] } = useJobCards();
  const { data: invoices = [] } = useInvoices();
  const { data: vehicles = [] } = useVehicles();

  const totalRevenue = invoices.reduce((sum, bill) => sum + (bill.totalBill ?? 0), 0);
  const totalJobs = jobCards.length;
  const avgJobValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;

  const serviceData = useMemo(() => {
    const counts: Record<string, { count: number; revenue: number }> = {};

    jobCards.forEach((job) => {
      const key = job.jobStatus || 'UNKNOWN';
      if (!counts[key]) {
        counts[key] = { count: 0, revenue: 0 };
      }
      counts[key].count += 1;
    });

    invoices.forEach((bill) => {
      const key = bill.billStatus || 'UNKNOWN';
      if (!counts[key]) {
        counts[key] = { count: 0, revenue: 0 };
      }
      counts[key].revenue += bill.totalBill ?? 0;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, ...value }));
  }, [invoices, jobCards]);

  const reportCards = [
    { title: 'Total Revenue', value: formatCurrency(totalRevenue), change: '-', icon: DollarSign, positive: true },
    { title: 'Total Jobs', value: String(totalJobs), change: '-', icon: Car, positive: true },
    { title: 'Customers', value: String(customers.length), change: '-', icon: Users, positive: true },
    { title: 'Avg Job Value', value: formatCurrency(avgJobValue), change: '-', icon: TrendingUp, positive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field w-auto"
          >
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="btn-primary">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{card.value}</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className={`text-sm font-medium ${card.positive ? 'text-status-completed' : 'text-status-cancelled'}`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <card.icon className="h-6 w-6 text-accent" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Service Breakdown</h2>
          <p className="text-sm text-muted-foreground">Derived from live database records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Jobs</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {serviceData.map((service, index) => (
                <tr key={index}>
                  <td className="font-medium text-foreground">{service.name}</td>
                  <td>{service.count}</td>
                  <td className="font-medium">{formatCurrency(service.revenue)}</td>
                </tr>
              ))}
              {serviceData.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted-foreground py-6">
                    No report data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Registered Vehicles</p>
          <p className="text-3xl font-bold text-foreground mt-2">{vehicles.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Paid Invoices</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {invoices.filter((bill) => bill.billStatus === 'PAID').length}
          </p>
        </div>
      </div>
    </div>
  );
};
