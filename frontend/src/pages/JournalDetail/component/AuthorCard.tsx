import React from "react";
import { NavigateFunction } from "react-router-dom";

interface Props {
  authorFullName: string;
  loading: boolean;
  userName: string;
  navigate: NavigateFunction;
}

export const AuthorCard: React.FC<Props> = ({
  authorFullName,
  loading,
  userName,
  navigate,
}) => (
  <div className="mt-8 bg-yellow-100 rounded-lg px-5 py-4 shadow-md border-l-4 border-yellow-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="handwritten-title text-lg text-gray-800">Journal by</p>
        {loading ? (
          <p className="handwritten-text text-xl text-gray-500 italic">
            Loading...
          </p>
        ) : (
          <p className="handwritten-text text-xl text-gray-900 font-semibold">
            {authorFullName}
          </p>
        )}
      </div>
      <button
        className="px-4 py-2 bg-amber-400 rounded-lg hover:bg-amber-500 text-gray-900 text-sm font-medium shadow-md transition-colors"
        onClick={() => navigate(`/profile/${userName}`)}
      >
        View Profile
      </button>
    </div>
  </div>
);
