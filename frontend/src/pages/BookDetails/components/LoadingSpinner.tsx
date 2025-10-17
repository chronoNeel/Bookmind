import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-amber-600" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-gray-600">Loading book details...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
