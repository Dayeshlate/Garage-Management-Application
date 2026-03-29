import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'paid';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-status-pending text-status-pending-foreground',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-status-progress text-status-progress-foreground',
  },
  completed: {
    label: 'Completed',
    className: 'bg-status-completed text-status-completed-foreground',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-status-cancelled text-status-cancelled-foreground',
  },
  paid: {
    label: 'Paid',
    className: 'bg-status-completed text-status-completed-foreground',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
