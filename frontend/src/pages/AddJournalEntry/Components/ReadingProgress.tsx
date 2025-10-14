interface ReadingProgressProps {
  progress: number;
  setProgress: (val: number) => void;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
  progress,
  setProgress,
}) => {
  return (
    <div className="mb-5">
      <label
        className="d-block fw-semibold mb-3 fs-5"
        style={{ color: "#5a4a3a" }}
      >
        Reading Progress
      </label>
      <div className="d-flex align-items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="flex-grow-1"
          style={{
            height: "6px",
            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
            borderRadius: "10px",
            outline: "none",
            WebkitAppearance: "none",
          }}
        />
        <span
          className="fw-semibold"
          style={{
            color: "#92400e",
            minWidth: "4rem",
          }}
        >
          {progress}%
        </span>
      </div>
      <div className="d-flex justify-content-between mt-1">
        <small className="text-muted">Want to Read</small>
        <small className="text-muted">Completed</small>
      </div>
    </div>
  );
};

export default ReadingProgress;
