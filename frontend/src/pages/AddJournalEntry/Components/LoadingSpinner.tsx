import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );
};

export default LoadingSpinner;
