import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex w-full rounded-lg bg-[#140D0A] border border-[#38220F] px-3.5 py-2.5 text-xs font-mono text-[#CFB28C] placeholder:text-[#CFB28C]/40 focus:border-[#D28A4C] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D28A4C] disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

