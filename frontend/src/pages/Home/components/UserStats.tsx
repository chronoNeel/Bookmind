import React from "react";
import StatCard from "./StatsCard";
import { Bookmark, Eye, CheckSquare } from "lucide-react";
import { useAppSelector } from "../../../hooks/redux";

interface userStat {
  wantToReadCount: number;
  ongoingCount: number;
  completedCount: number;
}

const UserStats: React.FC<userStat> = ({
  wantToReadCount,
  ongoingCount,
  completedCount,
}) => {
  const { completed, ongoing, wantToRead } = useAppSelector(
    (state) => state.shelf
  );

  return (
    <>
      <StatCard
        icon={Bookmark}
        label="Want to Read"
        count={wantToReadCount}
        color="#3b82f6"
      />
      <StatCard
        icon={Eye}
        label="Currently Reading"
        count={ongoingCount}
        color="#f59e0b"
      />
      <StatCard
        icon={CheckSquare}
        label="Completed"
        count={completedCount}
        color="#10b981"
      />
    </>
  );
};

export default UserStats;
