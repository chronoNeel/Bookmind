import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  arr: string[];
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  arr,
  color,
}) => (
  <div className="bg-white rounded p-4 shadow-sm">
    <div
      className="d-flex align-items-center"
      style={{
        borderLeft: `4px solid ${color}`,
        marginLeft: "-1rem",
        paddingLeft: "1rem",
      }}
    >
      <Icon style={{ width: "24px", height: "24px", color }} className="me-3" />
      <div>
        <p className="fs-3 fw-bold mb-1">{arr.length}</p>
        <p className="small text-secondary mb-0">{label}</p>
      </div>
    </div>
  </div>
);

export default StatCard;
