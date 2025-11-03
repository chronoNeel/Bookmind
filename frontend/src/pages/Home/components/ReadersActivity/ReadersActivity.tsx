import React from "react";
import { Users } from "lucide-react";
import ActivitySkeleton from "./ActivitySkeleton";
import ActivityItem from "./ActivityItem";
import { useReadersActivity } from "@/hooks/useReadersActivity";

const ReadersActivity: React.FC = () => {
  const { detailedActivities, loading, isLoadingUsers, error } =
    useReadersActivity();

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
          detailedActivities.map((a, i) => (
            <ActivityItem key={a.id} activity={a} index={i} />
          ))
        )}
      </div>
    </div>
  );
};

export default ReadersActivity;
