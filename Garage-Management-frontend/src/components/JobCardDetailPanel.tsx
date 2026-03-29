import React, { useState, useEffect } from 'react';
import { X, Car, User, Calendar, DollarSign, Wrench, Plus, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { ServiceProgressTracker, ServiceStep } from '@/components/ServiceProgressTracker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface SparePart {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface JobCardDetail {
  id: string;
  jobNumber: string;
  customer: string;
  vehicle: string;
  services: string[];
  status: StatusType;
  estimatedCost: number;
  assignedTo: string;
  createdAt: string;
  dueDate: string;
  spareParts?: { id: string; name: string; price: number; qty: number }[];
  serviceSteps?: ServiceStep[];
}

interface JobCardDetailPanelProps {
  job: JobCardDetail;
  open: boolean;
  onClose: () => void;
  onUpdateSteps: (jobId: string, steps: ServiceStep[]) => void;
  onUpdateParts: (jobId: string, parts: { id: string; name: string; price: number; qty: number }[]) => void;
  onStatusChange: (jobId: string, status: StatusType) => void;
  onUpdateDueDate: (jobId: string, dueDate: string) => void;
}

const availableSpareParts: SparePart[] = [
  { id: 'sp1', name: 'Oil Filter', price: 15, stock: 45 },
  { id: 'sp2', name: 'Air Filter', price: 25, stock: 30 },
  { id: 'sp3', name: 'Brake Pads (Set)', price: 85, stock: 20 },
  { id: 'sp4', name: 'Spark Plug', price: 12, stock: 60 },
  { id: 'sp5', name: 'Timing Belt', price: 45, stock: 15 },
  { id: 'sp6', name: 'Coolant (1L)', price: 18, stock: 40 },
  { id: 'sp7', name: 'Wiper Blades', price: 22, stock: 35 },
  { id: 'sp8', name: 'Battery', price: 120, stock: 10 },
];

export const JobCardDetailPanel: React.FC<JobCardDetailPanelProps> = ({
  job,
  open,
  onClose,
  onUpdateSteps,
  onUpdateParts,
  onStatusChange,
  onUpdateDueDate,
}) => {
  const { formatCurrency } = useSettings();
  const [selectedPart, setSelectedPart] = useState('');
  const [editingDueDate, setEditingDueDate] = useState(job.dueDate);
  const parts = job.spareParts || [];
  const steps = job.serviceSteps || [
    { label: 'Vehicle Received', done: false },
    { label: 'Inspection', done: false },
    { label: 'Service In Progress', done: false },
    { label: 'Quality Check', done: false },
    { label: 'Ready for Pickup', done: false },
  ];

  // Update editingDueDate when job changes
  useEffect(() => {
    setEditingDueDate(job.dueDate);
  }, [job.dueDate]);

  const handleStepChange = (stepIndex: number) => {
    const newSteps = steps.map((s, i) => {
      if (i <= stepIndex) {
        return { ...s, done: !steps[stepIndex].done ? true : i < stepIndex, active: false };
      }
      return { ...s, done: false, active: false };
    });

    // Set the active step
    const firstUndone = newSteps.findIndex((s) => !s.done);
    if (firstUndone >= 0) {
      newSteps[firstUndone].active = true;
    }

    // Auto-update job status based on steps
    const allDone = newSteps.every((s) => s.done);
    const anyInProgress = newSteps.some((s, i) => s.done && i >= 2);
    if (allDone) {
      onStatusChange(job.id, 'completed');
    } else if (anyInProgress) {
      onStatusChange(job.id, 'in-progress');
    } else {
      onStatusChange(job.id, 'pending');
    }

    onUpdateSteps(job.id, newSteps);
    toast({
      title: 'Progress updated',
      description: `Step "${steps[stepIndex].label}" ${!steps[stepIndex].done ? 'completed' : 'reverted'}`,
    });
  };

  const handleAddPart = () => {
    if (!selectedPart) return;
    const part = availableSpareParts.find((p) => p.id === selectedPart);
    if (!part) return;

    const existing = parts.find((p) => p.id === part.id);
    let newParts;
    if (existing) {
      newParts = parts.map((p) => (p.id === part.id ? { ...p, qty: p.qty + 1 } : p));
    } else {
      newParts = [...parts, { id: part.id, name: part.name, price: part.price, qty: 1 }];
    }
    onUpdateParts(job.id, newParts);
    setSelectedPart('');
    toast({ title: 'Part added', description: `${part.name} added to job card` });
  };

  const handleRemovePart = (partId: string) => {
    const newParts = parts.filter((p) => p.id !== partId);
    onUpdateParts(job.id, newParts);
  };

  const totalPartsCost = parts.reduce((sum, p) => sum + p.price * p.qty, 0);

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
            <span className="font-mono text-lg font-bold text-accent">{job.jobNumber}</span>
            <div className="flex items-center gap-2">
              <StatusBadge status={job.status} />
              <Select value={job.status} onValueChange={(status) => onStatusChange(job.id, status as StatusType)}>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Vehicle & Customer Info */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Car className="h-4 w-4 text-accent" />
                Vehicle Details
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-foreground font-medium">{job.vehicle}</p>
                <p className="text-muted-foreground">Services: {job.services.join(', ')}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="h-4 w-4 text-accent" />
                Customer Details
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-foreground font-medium">{job.customer}</p>
                <p className="text-muted-foreground">Technician: {job.assignedTo}</p>
              </div>
            </div>
          </div>

          {/* Dates & Cost */}
          <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Calendar className="h-4 w-4 text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-accent" />
                <p className="text-xs text-muted-foreground">Due Date</p>
              </div>
              <input
                type="date"
                value={editingDueDate}
                onChange={(e) => setEditingDueDate(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value !== job.dueDate) {
                    onUpdateDueDate(job.id, e.target.value);
                    toast({
                      title: 'Due date updated',
                      description: `Due date changed to ${new Date(e.target.value).toLocaleDateString()}`,
                    });
                  }
                }}
                className="input-field text-sm text-center w-full"
              />
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <DollarSign className="h-4 w-4 text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Est. Cost</p>
              <p className="text-sm font-medium">{formatCurrency(job.estimatedCost)}</p>
            </div>
          </div>

          {/* Service Progress Tracker */}
          <div className="bg-muted/50 rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-5">
              <Wrench className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground">Service Progress</h3>
              <span className="text-xs text-muted-foreground ml-auto">Click a step to update</span>
            </div>
            <ServiceProgressTracker
              steps={steps}
              onStepChange={handleStepChange}
              editable
            />
          </div>

          {/* Spare Parts Section */}
          <div className="bg-muted/50 rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground">Spare Parts</h3>
            </div>

            {/* Add Part */}
            <div className="flex gap-2 mb-4">
              <Select value={selectedPart} onValueChange={setSelectedPart}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a spare part..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSpareParts.map((part) => (
                    <SelectItem key={part.id} value={part.id}>
                      {part.name} — {formatCurrency(part.price)} ({part.stock} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddPart} disabled={!selectedPart} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {/* Parts List */}
            {parts.length > 0 ? (
              <div className="space-y-2">
                {parts.map((part, i) => (
                  <div
                    key={part.id}
                    className="flex items-center justify-between bg-card rounded-lg p-3 border border-border animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{part.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(part.price)} × {part.qty} = {formatCurrency(part.price * part.qty)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemovePart(part.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
                  <span className="text-sm font-semibold text-foreground">Total Parts Cost</span>
                  <span className="text-sm font-bold text-accent">{formatCurrency(totalPartsCost)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No spare parts added yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
