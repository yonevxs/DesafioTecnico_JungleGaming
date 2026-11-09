import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const NftCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3" data-testid="nft-card-skeleton">
      {/* Square Image Skeleton with rounded corners */}
      <Skeleton className="relative aspect-square w-full rounded-[22px]" />

      {/* Title Skeleton */}
      <Skeleton className="h-4 w-3/4 rounded mt-2" />

      {/* Price Skeleton */}
      <Skeleton className="h-4 w-1/3 rounded" />
    </div>
  );
};
