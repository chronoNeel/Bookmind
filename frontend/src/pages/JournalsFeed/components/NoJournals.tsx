import React from "react";

const NoJournals: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl shadow-lg p-16 text-center border border-amber-100">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon container with animated background */}
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        {/* Text content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          No Journals Yet
        </h3>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 opacity-40">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-300"></div>
        </div>
      </div>
    </div>
  );
};

export default NoJournals;
