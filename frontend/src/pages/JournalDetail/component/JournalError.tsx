import React from "react";
import { NavigateFunction } from "react-router-dom";

interface Props {
  error?: string | null;
  navigate: NavigateFunction;
}

export const JournalError: React.FC<Props> = ({ error, navigate }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-700 px-4">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">📖</div>
      <p className="text-2xl font-semibold mb-2">Journal Not Found</p>
      <p className="text-gray-600 mb-6">
        {error || "The journal you're looking for doesn't exist."}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-md font-medium"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-md font-medium"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
);
