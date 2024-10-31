import React from 'react';

interface Props {
  count?: number;
}

const GallerySkeletons: React.FC<Props> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="h-44 w-1/2 p-2 md:w-2/6 lg:w-1/6">
          <div key={index} className="h-full animate-pulse rounded-lg bg-gray-300 shadow-md"></div>
        </div>
      ))}
    </>
  );
};

export default GallerySkeletons;
