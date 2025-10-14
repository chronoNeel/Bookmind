import React from "react";
import { Users } from "lucide-react";

interface FriendsActivityProps {
  activities: {
    name: string;
    action: string;
    book: string;
    rating?: number;
    shelf?: string;
    avatar?: string;
  }[];
}

const FriendsActivity: React.FC<FriendsActivityProps> = ({ activities }) => (
  <div className="card border-0 rounded-3 shadow-sm">
    <div className="card-body p-4">
      <h3 className="card-title h5 fw-bold mb-3 d-flex align-items-center">
        <Users className="me-2 text-primary" size={20} /> Friends' Activity
      </h3>
      {activities.map((activity, index) => (
        <div
          key={index}
          className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 mb-2"
        >
          <img
            src={
              activity.avatar || `https://i.pravatar.cc/150?img=${index + 1}`
            }
            alt={activity.name}
            className="rounded-circle"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <div className="flex-fill small">
            <p className="mb-1">
              <span className="fw-semibold">{activity.name}</span>{" "}
              {activity.action}{" "}
              <span className="fw-semibold">"{activity.book}"</span>
            </p>
            {activity.rating && (
              <p className="text-warning mb-1">
                {"★".repeat(activity.rating)}
                {"☆".repeat(5 - activity.rating)}
              </p>
            )}
            <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
              2h ago
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FriendsActivity;
