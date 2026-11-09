import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-[#D28A4C] text-[#140D0A] border-transparent font-bold',
    secondary: 'bg-[#241612] text-[#E89B55] border-[#D28A4C]/50',
    outline: 'bg-transparent text-[#CFB28C] border-[#38220F]',
    success: 'bg-green-950/60 text-green-400 border-green-800/60',
    warning: 'bg-amber-950/60 text-[#E89B55] border-[#D28A4C]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

