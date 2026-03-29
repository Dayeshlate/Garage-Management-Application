import React from 'react';
import { 
  Users, 
  Car, 
  ClipboardList, 
  DollarSign,
  ArrowRight,
  Clock,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/StatCard';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { useSettings } from '@/context/SettingsContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18200 },
  { month: 'Apr', revenue: 16800 },
  { month: 'May', revenue: 21000 },
  { month: 'Jun', revenue: 24500 },
];

const jobsData = [
  { day: 'Mon', jobs: 12 },
  { day: 'Tue', jobs: 8 },
  { day: 'Wed', jobs: 15 },
  { day: 'Thu', jobs: 11 },
  { day: 'Fri', jobs: 18 },
  { day: 'Sat', jobs: 14 },
  { day: 'Sun', jobs: 5 },
];

const recentJobs = [
  { id: 'JC-001', customer: 'John Smith', vehicle: 'Toyota Camry 2022', service: 'Oil Change', status: 'in-progress' as StatusType },
  { id: 'JC-002', customer: 'Sarah Wilson', vehicle: 'Honda Civic 2021', service: 'Brake Repair', status: 'pending' as StatusType },
  { id: 'JC-003', customer: 'Mike Johnson', vehicle: 'Ford F-150 2020', service: 'Engine Tune-up', status: 'completed' as StatusType },
  { id: 'JC-004', customer: 'Emily Davis', vehicle: 'BMW X5 2023', service: 'AC Repair', status: 'in-progress' as StatusType },
  { id: 'JC-005', customer: 'Robert Brown', vehicle: 'Audi A4 2021', service: 'Tire Rotation', status: 'completed' as StatusType },
];

const lowStockItems = [
  { name: 'Engine Oil 5W-30', quantity: 5, unit: 'L' },
  { name: 'Brake Pads (Front)', quantity: 3, unit: 'sets' },
  { name: 'Air Filter', quantity: 8, unit: 'pcs' },
  { name: 'Spark Plugs', quantity: 12, unit: 'pcs' },
];

export const Dashboard: React.FC = () => {
  const { formatCurrency, currencySymbol } = useSettings();
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/job-cards" className="btn-primary">
          <ClipboardList className="h-4 w-4" />
          New Job Card
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value="1,284"
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Active Jobs"
          value="23"
          icon={ClipboardList}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Vehicles Serviced"
          value="156"
          icon={Car}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Revenue (MTD)"
          value={formatCurrency(24500)}
          icon={DollarSign}
          trend={{ value: 18.7, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Revenue Overview</h2>
            <select className="text-sm bg-muted px-3 py-1.5 rounded-lg border-none outline-none text-foreground">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${currencySymbol}${value / 1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Jobs Chart */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Jobs This Week</h2>
            <span className="text-sm text-muted-foreground">Total: 83 jobs</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={jobsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="jobs" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Job Cards</h2>
            <Link to="/job-cards" className="text-sm text-accent hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
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

        {/* Low Stock Alert */}
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
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 sm:p-4 gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base truncate">{item.name}</p>
                  <p className="text-xs sm:text-sm text-destructive">
                    Only {item.quantity} {item.unit} left
                  </p>
                </div>
                <button className="btn-secondary text-xs sm:text-sm py-1.5 px-2 sm:px-3 shrink-0">
                  Reorder
                </button>
              </div>
            ))}
          </div>       
          {/* <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-accent" />
            <span className="font-semibold text-foreground">Garage Assistant</span>
          </div> */}
         
        </div>
      </div>
    </div>
  );
};
