import React, { useState, useEffect } from 'react';
import { X, Package, AlertTriangle, Plus, Minus, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

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

interface InventoryDetailPanelProps {
  item: InventoryItem;
  open: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
}

export const InventoryDetailPanel: React.FC<InventoryDetailPanelProps> = ({
  item,
  open,
  onClose,
  onUpdateQuantity,
  onDelete,
  onUpdate,
}) => {
  const { formatCurrency, currencySymbol } = useSettings();
  const [editingQuantity, setEditingQuantity] = useState(item.quantity);
  const [editingMinStock, setEditingMinStock] = useState(item.minStock);
  const [editingPrice, setEditingPrice] = useState(item.unitPrice);
  const [hasChanges, setHasChanges] = useState(false);
  const isLowStock = item.quantity <= item.minStock;

  useEffect(() => {
    setEditingQuantity(item.quantity);
    setEditingMinStock(item.minStock);
    setEditingPrice(item.unitPrice);
    setHasChanges(false);
  }, [item]);

  const handleIncreaseStock = () => {
    const newQuantity = editingQuantity + 1;
    setEditingQuantity(newQuantity);
    setHasChanges(true);
  };

  const handleDecreaseStock = () => {
    if (editingQuantity > 0) {
      const newQuantity = editingQuantity - 1;
      setEditingQuantity(newQuantity);
      setHasChanges(true);
    }
  };

  const handleQuantityChange = (value: number) => {
    setEditingQuantity(value);
    setHasChanges(true);
  };

  const handleMinStockChange = (value: number) => {
    setEditingMinStock(value);
    setHasChanges(true);
  };

  const handlePriceChange = (value: number) => {
    setEditingPrice(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Update quantity if changed
    if (editingQuantity !== item.quantity) {
      onUpdateQuantity(item.id, editingQuantity);
    }

    // Update min stock and price if changed
    const updates: Partial<InventoryItem> = {};
    if (editingMinStock !== item.minStock) {
      updates.minStock = editingMinStock;
    }
    if (editingPrice !== item.unitPrice) {
      updates.unitPrice = editingPrice;
    }

    if (Object.keys(updates).length > 0) {
      onUpdate(item.id, updates);
    }

    setHasChanges(false);
    toast({
      title: 'Changes saved',
      description: `${item.name} has been updated successfully`,
    });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      onDelete(item.id);
      onClose();
      toast({
        title: 'Item deleted',
        description: `${item.name} has been removed from inventory`,
      });
    }
  };

  const totalValue = editingQuantity * editingPrice;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto transition-transform duration-300 ease-out shadow-2xl',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Package className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-mono text-sm text-muted-foreground">{item.sku}</p>
              <h2 className="text-lg font-bold text-foreground">{item.name}</h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stock Status Alert */}
          {isLowStock && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-3 animate-fade-in">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Low Stock Warning</p>
                <p className="text-sm text-destructive/80">
                  Current stock ({editingQuantity} {item.unit}) is below minimum ({editingMinStock} {item.unit})
                </p>
              </div>
            </div>
          )}

          {/* Item Info */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Category</p>
              <p className="text-sm font-medium text-foreground">{item.category}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Supplier</p>
              <p className="text-sm font-medium text-foreground">{item.supplier}</p>
            </div>
          </div>

          {/* Stock Management */}
          <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-fade-in">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-accent" />
              Stock Management
            </h3>

            {/* Current Stock */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current Stock</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecreaseStock}
                  className="h-9 w-9 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  value={editingQuantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="input-field flex-1 text-center text-lg font-semibold"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleIncreaseStock}
                  className="h-9 w-9 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {editingQuantity} {item.unit}
              </p>
            </div>

            {/* Minimum Stock Level */}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-sm font-medium text-foreground">Minimum Stock Level</label>
              <input
                type="number"
                value={editingMinStock}
                onChange={(e) => handleMinStockChange(Number(e.target.value))}
                className="input-field"
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Alert triggered when stock falls below this level
              </p>
            </div>
          </div>

          {/* Pricing & Value */}
          <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-fade-in">
            <h3 className="font-semibold text-foreground">Pricing & Value</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Unit Price</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{currencySymbol}</span>
                <input
                  type="number"
                  value={editingPrice}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="input-field flex-1"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="bg-card rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                <p className="text-lg font-bold text-accent">{formatCurrency(totalValue)}</p>
              </div>
              <div className="bg-card rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Reorder Cost</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(editingMinStock * editingPrice)}</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
            <Calendar className="h-4 w-4" />
            Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingQuantity(item.quantity);
                setEditingMinStock(item.minStock);
                setEditingPrice(item.unitPrice);
                setHasChanges(false);
              }}
              disabled={!hasChanges}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          {/* Delete Button */}
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete Item
          </Button>
        </div>
      </div>
    </>
  );
};
