import React, { useState } from 'react';
import { CheckCircle, Wrench, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceStep {
  label: string;
  done: boolean;
  active?: boolean;
}

interface ServiceProgressTrackerProps {
  steps: ServiceStep[];
  onStepChange?: (stepIndex: number) => void;
  editable?: boolean;
}

export const ServiceProgressTracker: React.FC<ServiceProgressTrackerProps> = ({
  steps,
  onStepChange,
  editable = false,
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const handleStepClick = (index: number) => {
    if (editable && onStepChange) {
      onStepChange(index);
    }
  };

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div
            className={cn(
              'flex flex-col items-center text-center flex-1 transition-all duration-300',
              editable && 'cursor-pointer group'
            )}
            onClick={() => handleStepClick(i)}
            onMouseEnter={() => setHoveredStep(i)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full mb-2 transition-all duration-500 ease-out',
                step.done
                  ? 'bg-accent text-accent-foreground scale-100'
                  : step.active
                  ? 'bg-accent/20 text-accent border-2 border-accent animate-pulse'
                  : 'bg-muted text-muted-foreground',
                editable && hoveredStep === i && !step.done && 'ring-2 ring-accent/50 scale-110',
                editable && hoveredStep === i && step.done && 'scale-110 ring-2 ring-destructive/50'
              )}
              style={{
                transform: step.done ? 'scale(1)' : undefined,
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {step.done ? (
                <CheckCircle className="h-5 w-5 animate-scale-in" />
              ) : step.active ? (
                <Wrench className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </div>
            <span
              className={cn(
                'text-xs transition-colors duration-300',
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
                step.done ? 'text-destructive' : 'text-accent'
              )}>
                {step.done ? 'Undo' : 'Mark done'}
              </span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 flex-1 -mt-6 transition-all duration-700 ease-out rounded-full',
                step.done ? 'bg-accent' : 'bg-border'
              )}
              style={{
                transformOrigin: 'left',
                animation: step.done ? 'slideRight 0.5s ease-out' : undefined,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
