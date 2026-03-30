import React, { useState } from 'react';
import { CheckCircle, Wrench, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StatusType } from '@/components/StatusBadge';

export interface ServiceStep {
  label: string;
  done: boolean;
  active?: boolean;
}

interface ServiceProgressTrackerProps {
  steps: ServiceStep[];
  onStepChange?: (stepIndex: number) => void;
  editable?: boolean;
  status?: StatusType;
}

export const ServiceProgressTracker: React.FC<ServiceProgressTrackerProps> = ({
  steps,
  onStepChange,
  editable = false,
  status = 'in-progress',
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const handleStepClick = (index: number) => {
    if (editable && onStepChange) {
      onStepChange(index);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-start gap-0 min-w-[680px]">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div
            className={cn(
              'flex flex-1 min-w-[120px] flex-col items-center text-center transition-all duration-300',
              editable && 'cursor-pointer group'
            )}
            onClick={() => handleStepClick(i)}
            onMouseEnter={() => setHoveredStep(i)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full mb-2 transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out',
                step.done
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : step.active
                  ? 'bg-accent/20 text-accent border-accent border-2'
                  : 'bg-muted text-muted-foreground',
                editable && hoveredStep === i && !step.done && 'ring-2 ring-accent/40 scale-105',
                editable && hoveredStep === i && step.done && 'scale-105 ring-2 ring-accent/40'
              )}
            >
              {step.done ? (
                <CheckCircle className="h-5 w-5 transition-transform duration-300 scale-100" />
              ) : step.active ? (
                <Wrench className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </div>
            <span
              className={cn(
                'mt-0.5 min-h-[2.5rem] max-w-[110px] text-xs leading-tight transition-colors duration-300',
                step.done || step.active
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
            {editable && (
              <span className={cn(
                'text-[10px] mt-0.5 transition-opacity duration-200',
                hoveredStep === i ? 'opacity-100' : 'opacity-0',
                'text-accent'
              )}>
                Set stage
              </span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div className="relative mt-5 mx-2 h-1 flex-1 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-border" />
              <div
                className={cn(
                  'absolute inset-y-0 left-0 w-full bg-accent origin-left transition-transform duration-500 ease-out',
                  step.done ? 'scale-x-100' : 'scale-x-0'
                )}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
    </div>
  );
};
