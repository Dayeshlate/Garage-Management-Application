import React, { useMemo, useState } from 'react';
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
import { useCreateInventoryItem, useInventory } from '@/hooks/use-api';

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

export const Inventory: React.FC = () => {
  const { formatCurrency } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const { data, isLoading, error, refetch } = useInventory();
  const createInventoryItem = useCreateInventoryItem();

  const inventory: InventoryItem[] = useMemo(
    () =>
      (data ?? []).map((item) => ({
        id: String(item.id),
        name: item.partName,
        sku: `SP-${item.id}`,
        category: item.manufacture || 'General',
        quantity: item.partStock,
        unit: 'pcs',
        minStock: 5,
        unitPrice: item.partPrice,
        supplier: item.manufacture || 'Unknown',
        lastUpdated: new Date().toISOString().split('T')[0],
      })),
    [data]
  );

  const handleAddItem = async (item: {
    name: string;
    sku: string;
    category: string;
    quantity: number;
    unit: string;
    minStock: number;
    unitPrice: number;
    supplier: string;
  }) => {
    try {
      await createInventoryItem.mutateAsync({
        partName: item.name,
        partStock: item.quantity,
        partPrice: item.unitPrice,
        manufacture: item.supplier || item.category,
        jobCardIds: null,
      });
      await refetch();
      toast({ title: 'Item added', description: `${item.name} has been added to inventory.` });
    } catch {
      toast({ title: 'Failed to add item', description: 'Could not create inventory item in backend.', variant: 'destructive' });
    }
  };

  const handleUpdateQuantity = () => {
    toast({ title: 'Not supported', description: 'Update inventory API is not available in backend yet.', variant: 'destructive' });
  };

  const handleUpdateItem = () => {
    toast({ title: 'Not supported', description: 'Update inventory API is not available in backend yet.', variant: 'destructive' });
  };

  const handleDeleteItem = () => {
    toast({ title: 'Not supported', description: 'Delete inventory API is not available in backend yet.', variant: 'destructive' });
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
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
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

      {isLoading && <p className="text-sm text-muted-foreground">Loading inventory...</p>}
      {error && <p className="text-sm text-destructive">Failed to load inventory from database.</p>}

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
