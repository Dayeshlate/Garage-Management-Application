import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Users, DollarSign, Car } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 12500, expenses: 8200 },
  { month: 'Feb', revenue: 15000, expenses: 9100 },
  { month: 'Mar', revenue: 18200, expenses: 10500 },
  { month: 'Apr', revenue: 16800, expenses: 9800 },
  { month: 'May', revenue: 21000, expenses: 12000 },
  { month: 'Jun', revenue: 24500, expenses: 13500 },
];

const serviceData = [
  { name: 'Oil Change', count: 145, revenue: 14500 },
  { name: 'Brake Repair', count: 89, revenue: 22250 },
  { name: 'Engine Tune-up', count: 67, revenue: 18760 },
  { name: 'AC Service', count: 54, revenue: 10800 },
  { name: 'Tire Service', count: 112, revenue: 8960 },
  { name: 'Full Service', count: 38, revenue: 20900 },
];

const customerSegments = [
  { name: 'Regular', value: 45, color: 'hsl(var(--accent))' },
  { name: 'New', value: 30, color: 'hsl(var(--chart-2))' },
  { name: 'Premium', value: 25, color: 'hsl(var(--chart-3))' },
];

export const Reports: React.FC = () => {
  const { formatCurrency, currencySymbol } = useSettings();
  const [dateRange, setDateRange] = useState('6months');

  const reportCards = [
    { title: 'Total Revenue', value: formatCurrency(107500), change: '+18.5%', icon: DollarSign, positive: true },
    { title: 'Total Jobs', value: '505', change: '+12.3%', icon: Car, positive: true },
    { title: 'New Customers', value: '89', change: '+8.7%', icon: Users, positive: true },
    { title: 'Avg Job Value', value: formatCurrency(213), change: '+5.2%', icon: TrendingUp, positive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
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

      {/* Summary Cards */}
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

      {/* Revenue Chart */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Revenue vs Expenses</h2>
            <p className="text-sm text-muted-foreground">Monthly financial overview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-2" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
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
              formatter={(value: number) => [`${formatCurrency(value)}`, '']}
            />
            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            <Area type="monotone" dataKey="expenses" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Performance */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Service Performance</h2>
            <p className="text-sm text-muted-foreground">Jobs completed by service type</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Segments */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Customer Segments</h2>
            <p className="text-sm text-muted-foreground">Distribution by customer type</p>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                <span className="text-sm text-muted-foreground">{segment.name} ({segment.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Services Table */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Top Performing Services</h2>
          <p className="text-sm text-muted-foreground">Revenue breakdown by service type</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Jobs Completed</th>
                <th>Revenue</th>
                <th>Avg. Price</th>
              </tr>
            </thead>
            <tbody>
              {serviceData.map((service, index) => (
                <tr key={index}>
                  <td className="font-medium text-foreground">{service.name}</td>
                  <td>{service.count}</td>
                  <td className="font-medium">{formatCurrency(service.revenue)}</td>
                  <td>{formatCurrency(Math.round(service.revenue / service.count))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
