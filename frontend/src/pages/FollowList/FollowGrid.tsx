import React from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "@models/user";
import FollowCard from "./FollowCard";

interface Props {
  users: UserData[];
  currentUser: UserData;
  isFollowing: (id: string) => boolean;
  getFollowerCount: (user: UserData) => number;
  toggleFollow: (e: React.MouseEvent, user: UserData) => void;
}

const FollowGrid: React.FC<Props> = ({
  users,
  currentUser,
  isFollowing,
  getFollowerCount,
  toggleFollow,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {users.map((user) => (
        <FollowCard
          key={user.uid}
          user={user}
          following={isFollowing(user.uid)}
          followerCount={getFollowerCount(user)}
          currentUser={currentUser}
          onToggleFollow={toggleFollow}
          onClick={() => navigate(`/profile/${user.userName}`)}
        />
      ))}
    </div>
  );
};

export default FollowGrid;
