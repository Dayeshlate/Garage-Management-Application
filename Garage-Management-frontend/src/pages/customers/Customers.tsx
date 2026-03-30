import React, { useState } from 'react';
import { Plus, Search, Phone, Mail, MoreVertical } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { useSettings } from '@/context/SettingsContext';
import { useCustomers } from '@/hooks/use-api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicleCount: number;
  totalSpent: number;
}

export const Customers: React.FC = () => {
  const { formatCurrency } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useCustomers();

  const customers: Customer[] = (data ?? []).map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    vehicleCount: customer.vehicle_ids?.length ?? 0,
    totalSpent: 0,
  }));

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold">
            {customer.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{customer.name}</p>
            <p className="text-sm text-muted-foreground">Customer ID: {customer.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (customer: Customer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {customer.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {customer.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'vehicleCount',
      header: 'Vehicles',
      render: (customer: Customer) => (
        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-muted text-sm font-medium">
          {customer.vehicleCount}
        </span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      render: (customer: Customer) => (
        <span className="font-medium text-foreground">
          {formatCurrency(customer.totalSpent)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (customer: Customer) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
            <DropdownMenuItem>View Vehicles</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer database</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-bold text-foreground mt-1">{customers.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Vehicles</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {customers.reduce((sum, c) => sum + c.vehicleCount, 0)}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading customers...</p>}
      {error && <p className="text-sm text-destructive">Failed to load customers from database.</p>}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        emptyMessage="No customers found"
      />
    </div>
  );
};
