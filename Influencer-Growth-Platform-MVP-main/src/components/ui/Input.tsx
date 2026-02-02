import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  icon,
  ...props
}, ref) => {
  return <div className="w-full space-y-1.5">
        {label && <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {label}
          </label>}
        <div className="relative group">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors">
              {icon}
            </div>}
          <input ref={ref} className={cn('flex h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all duration-200', icon && 'pl-10', error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20', className)} {...props} />
        </div>
        {error && <p className="text-xs text-red-500 animate-in slide-in-from-top-1 fade-in duration-200">
            {error}
          </p>}
      </div>;
});
Input.displayName = 'Input';