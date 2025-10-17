import React from "react";

interface ErrorMessageProps {
  error: string | null;
  onGoBack: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onGoBack }) => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <p className="text-danger">{error || "Book not found"}</p>
        <button onClick={onGoBack} className="btn btn-primary mt-3">
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
