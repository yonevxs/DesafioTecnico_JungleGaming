import * as React from 'react';
import { cn } from '@/lib/utils';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Carregando conteúdo"
      className={cn(
        'rounded-lg bg-[#241612] shimmer motion-reduce:animate-none overflow-hidden',
        className
      )}
      {...props}
    />
  );
}

