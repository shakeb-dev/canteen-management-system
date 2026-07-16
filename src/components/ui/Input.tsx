import React, { type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, rightElement, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label-text">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={cn(
              'input-field',
              rightElement && 'pr-11',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-[11px] font-black uppercase tracking-widest text-destructive ml-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';




