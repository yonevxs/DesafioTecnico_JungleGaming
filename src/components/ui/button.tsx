import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => {
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      default:
        'bg-[#D28A4C] text-[#140D0A] font-bold hover:bg-[#E89B55] shadow-md shadow-[#D28A4C]/10',
      secondary:
        'bg-[#241612] text-[#CFB28C] border border-[#38220F] hover:border-[#D28A4C]/60 hover:text-[#E89B55]',
      outline:
        'border border-[#38220F] bg-transparent text-[#CFB28C] hover:bg-[#241612] hover:text-[#E89B55]',
      ghost:
        'bg-transparent text-[#CFB28C]/80 hover:bg-[#241612] hover:text-[#E89B55]',
      destructive:
        'bg-red-950/60 border border-red-800/80 text-red-300 hover:bg-red-900/60',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      default: 'h-10 px-4 py-2 text-xs rounded-lg',
      sm: 'h-8 px-3 py-1.5 text-xs rounded-lg',
      lg: 'h-12 px-6 py-3 text-sm rounded-xl',
      icon: 'h-9 w-9 rounded-full flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-mono transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D28A4C] disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

