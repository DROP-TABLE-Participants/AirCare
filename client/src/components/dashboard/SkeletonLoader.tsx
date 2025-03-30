import React from 'react';

export const SkeletonLoader = () => {
  return (
    <div className="flex items-center justify-center h-48 w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
    </div>
  );
};

export const AnalyticsSkeletonLoader = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-[300px]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
        <p className="mt-3 text-gray-600">Loading data...</p>
      </div>
    </div>
  );
};

export default SkeletonLoader;