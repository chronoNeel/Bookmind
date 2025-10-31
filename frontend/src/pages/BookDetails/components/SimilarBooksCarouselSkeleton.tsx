import React from "react";

const SimilarBooksCarouselSkeleton: React.FC = () => {
  return (
    <div className="mb-12">
      <div className="relative bg-white rounded-3xl shadow-md p-8 overflow-hidden">
        <div className="flex gap-6">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex-shrink-0 w-48">
              <div className="w-full h-72 bg-gray-200 rounded-xl animate-pulse" />
              <div className="mt-3 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarBooksCarouselSkeleton;
