import React from "react";

interface ActionButtonsProps {
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  isEditMode: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSaving,
  onSave,
  onCancel,
  isEditMode,
}) => {
  return (
    <div className="d-flex justify-content-end gap-3">
      <button
        onClick={onCancel}
        disabled={isSaving}
        className="btn px-4 py-2 border-2 rounded-3 fw-medium transition-all"
        style={{
          borderColor: "rgba(253, 230, 138, 0.8)",
          color: "#5a4a3a",
          background: "rgba(255, 255, 255, 0.7)",
          minWidth: "120px",
        }}
        onMouseOver={(e) => {
          if (!isSaving) {
            e.currentTarget.style.background = "rgba(253, 230, 138, 0.2)";
            e.currentTarget.style.borderColor = "#f59e0b";
          }
        }}
        onMouseOut={(e) => {
          if (!isSaving) {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
            e.currentTarget.style.borderColor = "rgba(253, 230, 138, 0.8)";
          }
        }}
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="btn px-4 py-2 rounded-3 fw-medium text-white border-0 transition-all d-flex align-items-center gap-2"
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          minWidth: "140px",
          opacity: isSaving ? 0.7 : 1,
        }}
        onMouseOver={(e) => {
          if (!isSaving) {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #d97706 0%, #b45309 100%)";
          }
        }}
        onMouseOut={(e) => {
          if (!isSaving) {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
          }
        }}
      >
        {isSaving ? (
          <>
            <div
              className="spinner-border spinner-border-sm"
              style={{
                width: "16px",
                height: "16px",
                borderWidth: "2px",
              }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            {isEditMode ? "Updating..." : "Saving..."}
          </>
        ) : isEditMode ? (
          "Update Entry"
        ) : (
          "Save Entry"
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
