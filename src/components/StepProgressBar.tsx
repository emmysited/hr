import React from 'react';
import { Step } from '../types';
import { Check } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: Step;
  variant?: 'sidebar' | 'horizontal';
}

const STEPS = [
  { id: 1 as Step, label: 'Application Form', shortLabel: 'Form' },
  { id: 2 as Step, label: 'Job Simulation', shortLabel: 'Simulation' },
  { id: 3 as Step, label: 'Final Results', shortLabel: 'Results' },
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, variant = 'sidebar' }) => {
  if (variant === 'sidebar') {
    return (
      <div className="space-y-4" id="sidebar-progress-tracker">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              id={`prog-${step.id}`}
              className={`flex items-center gap-3 transition-all duration-200 ${
                isCurrent
                  ? 'opacity-100 font-bold text-white'
                  : isCompleted
                  ? 'opacity-90 text-blue-100 font-medium'
                  : 'opacity-40 text-white font-normal'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-white text-[#1B3A6B]'
                    : isCurrent
                    ? 'border border-white bg-white/20 text-white ring-2 ring-white/30'
                    : 'border border-white/60 text-white'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.id}
              </div>
              <span className="text-sm tracking-wide">{step.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant for mobile header
  return (
    <div className="flex items-center justify-between gap-2 py-2" id="mobile-progress-tracker">
      {STEPS.map((step) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div
            key={step.id}
            className={`flex items-center gap-1.5 text-xs transition-all ${
              isCurrent
                ? 'text-[#1B3A6B] font-bold'
                : isCompleted
                ? 'text-slate-700 font-medium'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isCompleted
                  ? 'bg-[#1B3A6B] text-white'
                  : isCurrent
                  ? 'border border-[#1B3A6B] text-[#1B3A6B]'
                  : 'border border-slate-300 text-slate-400'
              }`}
            >
              {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : step.id}
            </div>
            <span className="hidden xs:inline">{step.shortLabel}</span>
          </div>
        );
      })}
    </div>
  );
};
