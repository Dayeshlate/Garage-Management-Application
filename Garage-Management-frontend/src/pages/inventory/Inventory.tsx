import React, { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, MoreVertical } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { AddInventoryDialog } from '@/components/AddInventoryDialog';
import { InventoryDetailPanel } from '@/components/InventoryDetailPanel';
import { useSettings } from '@/context/SettingsContext';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  unitPrice: number;
  supplier: string;
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Engine Oil 5W-30', sku: 'OIL-5W30-01', category: 'Lubricants', quantity: 45, unit: 'Liters', minStock: 20, unitPrice: 12.50, supplier: 'AutoParts Inc', lastUpdated: '2024-03-15' },
  { id: '2', name: 'Brake Pads (Front)', sku: 'BRK-FRT-01', category: 'Brakes', quantity: 8, unit: 'Sets', minStock: 10, unitPrice: 65.00, supplier: 'BrakeMaster Co', lastUpdated: '2024-03-14' },
  { id: '3', name: 'Air Filter - Universal', sku: 'FLT-AIR-01', category: 'Filters', quantity: 25, unit: 'Pieces', minStock: 15, unitPrice: 18.00, supplier: 'FilterWorld', lastUpdated: '2024-03-16' },
  { id: '4', name: 'Spark Plugs - Iridium', sku: 'SPK-IRD-01', category: 'Ignition', quantity: 40, unit: 'Pieces', minStock: 20, unitPrice: 8.50, supplier: 'SparkTech', lastUpdated: '2024-03-12' },
  { id: '5', name: 'Coolant - Green', sku: 'CLT-GRN-01', category: 'Coolants', quantity: 30, unit: 'Liters', minStock: 25, unitPrice: 9.00, supplier: 'AutoParts Inc', lastUpdated: '2024-03-17' },
  { id: '6', name: 'Transmission Fluid ATF', sku: 'TRN-ATF-01', category: 'Lubricants', quantity: 5, unit: 'Liters', minStock: 15, unitPrice: 15.00, supplier: 'LubeMax', lastUpdated: '2024-03-10' },
  { id: '7', name: 'Wiper Blades - 22"', sku: 'WPR-22-01', category: 'Accessories', quantity: 18, unit: 'Pairs', minStock: 10, unitPrice: 22.00, supplier: 'ClearView', lastUpdated: '2024-03-13' },
  { id: '8', name: 'Battery - 12V 60Ah', sku: 'BAT-12V-60', category: 'Electrical', quantity: 6, unit: 'Pieces', minStock: 5, unitPrice: 120.00, supplier: 'PowerCell', lastUpdated: '2024-03-18' },
];

export const Inventory: React.FC = () => {
  const { formatCurrency } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [inventory, setInventory] = useState(mockInventory);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleAddItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: String(inventory.length + 1),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setInventory([newItem, ...inventory]);
    toast({ title: 'Item added', description: `${item.name} has been added to inventory.` });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity, lastUpdated: new Date().toISOString().split('T')[0] } : item
      )
    );
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => prev ? { ...prev, quantity, lastUpdated: new Date().toISOString().split('T')[0] } : prev);
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : item
      )
    );
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => prev ? { ...prev, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : prev);
    }
  };

  const handleDeleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRowClick = (item: { id: string | number }) => {
    const fullItem = inventory.find((inv) => inv.id === String(item.id));
    if (fullItem) setSelectedItem(fullItem);
  };

  const categories = ['all', ...new Set(inventory.map((item) => item.category))];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = inventory.filter((item) => item.quantity <= item.minStock).length;
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const columns = [
    {
      key: 'name',
      header: 'Item',
      render: (item: InventoryItem) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Package className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground font-mono">{item.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item: InventoryItem) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-sm">
          {item.category}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Stock',
      render: (item: InventoryItem) => {
        const isLowStock = item.quantity <= item.minStock;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isLowStock ? 'text-destructive' : 'text-foreground'}`}>
              {item.quantity} {item.unit}
            </span>
            {isLowStock && <AlertTriangle className="h-4 w-4 text-status-pending" />}
          </div>
        );
      },
    },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      render: (item: InventoryItem) => (
        <span className="font-medium">{formatCurrency(item.unitPrice)}</span>
      ),
    },
    {
      key: 'value',
      header: 'Total Value',
      render: (item: InventoryItem) => (
        <span className="font-medium text-foreground">
          {formatCurrency(item.quantity * item.unitPrice)}
        </span>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (item: InventoryItem) => (
        <span className="text-muted-foreground">{item.supplier}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (item: InventoryItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedItem(item)}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Reorder</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteItem(item.id)}>Delete</DropdownMenuItem>
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
          <h1 className="page-title">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage spare parts and supplies</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Items</p>
          <p className="text-2xl font-bold text-foreground mt-1">{inventory.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-2xl font-bold text-foreground mt-1">{categories.length - 1}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Low Stock Items</p>
          <p className="text-2xl font-bold text-destructive mt-1">{lowStockCount}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalValue)}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-field w-auto"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredInventory}
        emptyMessage="No inventory items found"
        onRowClick={handleRowClick}
      />

      <AddInventoryDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddItem} />

      {selectedItem && (
        <InventoryDetailPanel
          item={selectedItem}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdateQuantity={handleUpdateQuantity}
          onDelete={handleDeleteItem}
          onUpdate={handleUpdateItem}
        />
      )}
    </div>
  );
};
