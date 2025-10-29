import React from "react";
import { Clock, CheckCircle, Trash2 } from "lucide-react";
import { statusOptions } from "./statusHelpers";
import { BookDetails } from "@models/Book";
import { StatusValue } from "@models/StatusModal";

interface Props {
  book: BookDetails;
  authors: string;
  currentStatus: StatusValue;
  onClose: () => void;
  onStatusChange: (status: StatusValue) => void;
}

const StatusModal: React.FC<Props> = ({
  book,
  authors,
  currentStatus,
  onClose,
  onStatusChange,
}) => {
  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,.6)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Clock size={20} /> Update Reading Status
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="alert alert-light border rounded-3 mb-4">
              <h5 className="fw-semibold mb-1">{book.title}</h5>
              <small className="text-muted">{authors}</small>
            </div>

            <div className="d-grid gap-2">
              {statusOptions.map((o) => {
                const isSelected = currentStatus === o.value;
                const isRemove = o.value === "remove";

                return (
                  <button
                    key={o.value}
                    onClick={() => onStatusChange(o.value)}
                    disabled={isRemove && !currentStatus}
                    className={`btn text-start d-flex align-items-center justify-content-between border rounded-3 shadow-sm ${
                      isRemove ? "btn-outline-danger" : "bg-white"
                    }`}
                    style={{
                      padding: "0.9rem 1rem",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <span className="fw-medium">{o.label}</span>

                    {isSelected && !isRemove && (
                      <CheckCircle
                        size={22}
                        color="#198754"
                        strokeWidth={2.5}
                      />
                    )}
                    {isRemove && <Trash2 size={20} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-4 rounded-pill"
              onClick={onClose}
            >
              × Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
