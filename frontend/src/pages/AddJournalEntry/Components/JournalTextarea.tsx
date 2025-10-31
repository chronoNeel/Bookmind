import React from "react";

interface JournalTextareaProps {
  entry: string;
  setEntry: (val: string) => void;
  isPrivate: boolean;
  setIsPrivate: (val: boolean) => void;
}

const JournalTextarea: React.FC<JournalTextareaProps> = ({
  entry,
  setEntry,
  isPrivate,
  setIsPrivate,
}) => {
  const maxWords = 1000;
  const wordCount = entry
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <label className="fw-semibold fs-5" style={{ color: "#5a4a3a" }}>
          Review & Reflections
        </label>

        {/* Privacy Toggle */}
        <div className="d-flex align-items-center gap-3">
          <span
            className={`small fw-medium ${
              !isPrivate ? "text-muted" : "text-dark"
            }`}
          >
            Private
          </span>
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={`position-relative d-inline-flex align-items-center h-6 w-11 rounded-pill border-0 transition-all focus-outline-none`}
            style={{
              background: isPrivate
                ? "#e5e7eb"
                : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              transition: "all 0.3s ease",
            }}
          >
            <span
              className={`position-absolute d-inline-block h-4 w-4 rounded-circle bg-white shadow-sm transition-all`}
              style={{
                transform: isPrivate ? "translateX(3px)" : "translateX(23px)",
                transition: "all 0.3s ease",
              }}
            />
          </button>
          <span
            className={`small fw-medium ${
              isPrivate ? "text-muted" : "text-amber-600"
            }`}
          >
            Public
          </span>
        </div>
      </div>

      {/* Privacy Status Indicator */}
      <div className="mb-3">
        <div
          className={`d-inline-flex align-items-center px-3 py-2 rounded-pill small fw-medium border`}
          style={{
            background: isPrivate
              ? "rgba(107, 114, 128, 0.1)"
              : "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
            color: isPrivate ? "#6b7280" : "#92400e",
            borderColor: isPrivate
              ? "rgba(107, 114, 128, 0.2)"
              : "rgba(245, 158, 11, 0.3)",
          }}
        >
          <span
            className={`d-inline-block rounded-circle me-2`}
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: isPrivate ? "#9ca3af" : "#f59e0b",
            }}
          ></span>
          {isPrivate
            ? "Only you can see this entry"
            : "This entry will be visible to others"}
        </div>
      </div>

      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="What are your thoughts on this book? Share your insights, favorite quotes, character analysis, or any reflections..."
        className="w-100 p-4 border-2 rounded-3 focus-outline-none resize-none"
        style={{
          height: "250px",
          fontFamily: "Georgia, serif",
          color: "#5a4a3a",
          lineHeight: "1.6",
          background: "rgba(255, 255, 255, 0.8)",
          borderColor: "rgba(253, 230, 138, 0.5)",
          fontSize: "0.95rem",
          transition: "all 0.3s ease",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#f59e0b";
          e.target.style.background = "rgba(255, 255, 255, 0.95)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(253, 230, 138, 0.5)";
          e.target.style.background = "rgba(255, 255, 255, 0.8)";
        }}
      />

      <div className="d-flex justify-content-between align-items-center mt-2">
        <span
          className={`small ${
            wordCount > maxWords ? "text-danger" : "text-muted"
          }`}
        >
          {wordCount} / {maxWords} words
        </span>
        {wordCount > maxWords && (
          <span className="small text-danger">Exceeded word limit</span>
        )}
      </div>
    </div>
  );
};

export default JournalTextarea;
