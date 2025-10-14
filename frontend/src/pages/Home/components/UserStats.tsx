import React from "react";
import StatCard from "./StatsCard";
import { Bookmark, Eye, CheckSquare } from "lucide-react";
import { useAppSelector } from "../../../hooks/redux";

const UserStats: React.FC = () => {
  const { completed, ongoing, wantToRead } = useAppSelector(
    (state) => state.shelf
  );

  return (
    <>
      <StatCard
        icon={Bookmark}
        label="Want to Read"
        arr={wantToRead}
        color="#3b82f6"
      />
      <StatCard
        icon={Eye}
        label="Currently Reading"
        arr={ongoing}
        color="#f59e0b"
      />
      <StatCard
        icon={CheckSquare}
        label="Completed"
        arr={completed}
        color="#10b981"
      />
    </>
  );
};

export default UserStats;
