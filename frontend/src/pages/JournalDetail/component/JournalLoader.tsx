import React from "react";

export const JournalLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto mb-4"></div>
      <p className="text-lg text-gray-700 font-medium">Loading journal...</p>
    </div>
  </div>
);
