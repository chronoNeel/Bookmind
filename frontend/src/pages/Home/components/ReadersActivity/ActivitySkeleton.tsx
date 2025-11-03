import React from "react";

const ActivitySkeleton: React.FC = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 mb-2"
        >
          <div
            className="rounded-circle bg-secondary"
            style={{
              width: "32px",
              height: "32px",
              flexShrink: 0,
              opacity: 0.3,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div className="flex-fill">
            <div
              className="bg-secondary rounded mb-2"
              style={{
                height: "14px",
                width: "80%",
                opacity: 0.3,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            <div
              className="bg-secondary rounded mb-2"
              style={{
                height: "12px",
                width: "40%",
                opacity: 0.3,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: "0.1s",
              }}
            />
            <div
              className="bg-secondary rounded"
              style={{
                height: "10px",
                width: "25%",
                opacity: 0.3,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: "0.2s",
              }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default ActivitySkeleton;
