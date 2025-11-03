import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Users } from "lucide-react";
import { getAllActivites } from "@/store/slices/activitySlice";
import { fetchUserProfile } from "@/store/slices/userSlice";
import { activity } from "@/models/activity";
import { useNavigate } from "react-router-dom";

type activityDetails = activity & {
  bookTitle: string;
  userFullName: string;
  userName: string;
  userProfilePic: string;
};

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
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
};

const ReadersActivity: React.FC = () => {
  const { activities, loading, error } = useAppSelector(
    (state) => state.activity
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [detailedActivities, setDetailedActivities] = useState<
    activityDetails[]
  >([]);

  useEffect(() => {
    dispatch(getAllActivites());
  }, [dispatch]);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (activities.length === 0) return;

      setIsLoadingUsers(true);
      try {
        const bookActivities = [...activities]
          .sort(
            (a, b) =>
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          )
          .slice(0, 3);

        if (bookActivities.length === 0) {
          setDetailedActivities([]);
          return;
        }

        const addedData = await Promise.all(
          bookActivities.map(async (activity) => {
            try {
              const userData = await dispatch(
                fetchUserProfile(activity.uid)
              ).unwrap();

              const bookUrl = `https://openlibrary.org${activity.bookKey}.json`;

              const res = await fetch(bookUrl);
              if (!res.ok) {
                console.warn(`Failed to fetch book at ${bookUrl}`);
                throw new Error("Failed to fetch book data");
              }

              const bookData = await res.json();

              return {
                ...activity,
                bookTitle: bookData?.title || "Unknown Title",
                userFullName: userData?.fullName || "Unknown User",
                userName: userData?.userName || "Unknown username",
                userProfilePic: userData.profilePic,
              };
            } catch (err: unknown) {
              console.error(
                `Error fetching details for activity ${activity.id}:`,
                err
              );
              return {
                ...activity,
                bookTitle: "Unknown Title",
                userFullName: "Unknown User",
                userName: "Unknown username",
                userProfilePic: "",
              };
            }
          })
        );

        setDetailedActivities(addedData.filter(Boolean) as activityDetails[]);
      } catch (err) {
        console.error("Error in fetchActivityDetails:", err);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchActivityDetails();
  }, [activities, dispatch]);

  const getActionText = (activity: activityDetails) => {
    if (activity.action === "add_to_journal") {
      return "rated";
    }

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
  };

  const getShelfText = (shelfStatus?: string) => {
    switch (shelfStatus) {
      case "completed":
        return "Completed";
      case "reading":
        return "Currently Reading";
      case "want-to-read":
        return "Want to Read";
      default:
        return "";
    }
  };

  return (
    <div className="card border-0 rounded-3 shadow-sm">
      <div className="card-body p-4">
        <h3 className="card-title h5 fw-bold mb-3 d-flex align-items-center">
          <Users className="me-2 text-primary" size={20} />
          Readers on BookMind
        </h3>

        {loading || isLoadingUsers ? (
          <ActivitySkeleton />
        ) : error ? (
          <p className="text-danger">Error: {error}</p>
        ) : detailedActivities.length === 0 ? (
          <p className="text-muted">No recent reading activities found.</p>
        ) : (
          <>
            {detailedActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 mb-2"
              >
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
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
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
                  {activity.action === "add_to_shelf" &&
                    activity.shelfStatus && (
                      <p
                        className="text-muted mb-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {getShelfText(activity.shelfStatus)}
                      </p>
                    )}
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {timeAgo(activity.addedAt)}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ReadersActivity;
