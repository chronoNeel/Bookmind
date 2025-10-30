import React from "react";

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null; // optional: don't render if no error
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="alert alert-danger">{error}</div>
    </div>
  );
};

export default ErrorDisplay;
