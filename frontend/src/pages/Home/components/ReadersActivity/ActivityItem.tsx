import React from "react";
import { useNavigate } from "react-router-dom";
import { activityDetails } from "@/hooks/useReadersActivity";

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

function getActionText(activity: activityDetails) {
  if (activity.action === "add_to_journal") return "rated";
  if (activity.action === "add_to_shelf") {
    switch (activity.shelfStatus) {
      case "completed":
        return "finished";
      case "reading":
        return "started";
      case "want-to-read":
        return "added";
      default:
        return "added";
    }
  }
  return "added";
}

function getShelfText(status?: string) {
  switch (status) {
    case "completed":
      return "Completed";
    case "reading":
      return "Currently Reading";
    case "want-to-read":
      return "Want to Read";
    default:
      return "";
  }
}

const ActivityItem: React.FC<{ activity: activityDetails; index: number }> = ({
  activity,
  index,
}) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 mb-2">
      <img
        src={
          activity.userProfilePic ||
          `https://i.pravatar.cc/150?img=${index + 1}`
        }
        alt={activity.userFullName}
        onClick={() => navigate(`/profile/${activity.userName}`)}
        className="rounded-circle"
        style={{
          width: "32px",
          height: "32px",
          objectFit: "cover",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />

      <div className="flex-fill small">
        <p className="mb-1">
          <span
            className="fw-semibold hover:cursor-pointer hover:underline"
            onClick={() => navigate(`/profile/${activity.userName}`)}
          >
            {activity.userFullName.split(" ")[0]}
          </span>{" "}
          {getActionText(activity)}{" "}
          <span className="fw-semibold hover:underline hover:cursor-pointer">{`"${activity.bookTitle}"`}</span>
        </p>

        {activity.action === "add_to_journal" && activity.rating && (
          <p className="text-warning mb-1">
            {"★".repeat(activity.rating)}
            {"☆".repeat(5 - activity.rating)}
          </p>
        )}

        {activity.action === "add_to_shelf" && activity.shelfStatus && (
          <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
            {getShelfText(activity.shelfStatus)}
          </p>
        )}

        <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
          {timeAgo(activity.addedAt)}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;
