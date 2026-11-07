import React from 'react';

export const NftCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3">
      {/* Square Image Skeleton with rounded corners */}
      <div className="relative aspect-square w-full rounded-[22px] bg-[#241612] shimmer overflow-hidden" />

      {/* Title Skeleton */}
      <div className="h-4 w-3/4 rounded bg-[#241612] shimmer mt-2" />

      {/* Price Skeleton */}
      <div className="h-4 w-1/3 rounded bg-[#241612] shimmer" />
    </div>
  );
};
