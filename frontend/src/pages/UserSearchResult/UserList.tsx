import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Users } from "lucide-react";
import { useAppSelector } from "../../hooks/redux";
import { UserData } from "../../models/user";
import api from "../../utils/api";

interface Props {
  users: UserData[];
}

const UserList: React.FC<Props> = ({ users }) => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((s) => s.auth.user);
  const [followingStates, setFollowingStates] = useState<
    Record<string, boolean>
  >({});
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>(
    {}
  );

  const isFollowing = (id: string): boolean =>
    followingStates[id] ?? currentUser?.following?.includes(id) ?? false;

  const getFollowerCount = (user: UserData): number =>
    followerCounts[user.uid] ?? user.followers?.length ?? 0;

  const toggleFollow = async (e: React.MouseEvent, targetUser: UserData) => {
    e.stopPropagation();
    if (!currentUser) return navigate("/login");

    const targetUid = targetUser.uid;
    const nextFollowing = !isFollowing(targetUid);

    // Optimistic update
    setFollowingStates((prev) => ({ ...prev, [targetUid]: nextFollowing }));
    setFollowerCounts((prev) => ({
      ...prev,
      [targetUid]: getFollowerCount(targetUser) + (nextFollowing ? 1 : -1),
    }));

    try {
      await api.post(`/api/users/follow`, { targetUid });
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      // Rollback on error
      setFollowingStates((prev) => ({ ...prev, [targetUid]: !nextFollowing }));
      setFollowerCounts((prev) => ({
        ...prev,
        [targetUid]: getFollowerCount(targetUser) - (nextFollowing ? 1 : -1),
      }));
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {users.map((user) => {
        const following = isFollowing(user.uid);
        const followerCount = getFollowerCount(user);

        return (
          <div
            key={user.uid}
            onClick={() => navigate(`/profile/${user.uid}`)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 cursor-pointer p-5 flex items-center gap-4"
          >
            <img
              src={user.profilePic}
              alt={user.fullName}
              className="rounded-full w-16 h-16 object-cover border-2 border-gray-100"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {user.fullName}
                </h3>
                <span className="text-sm text-gray-500 truncate">
                  @{user.userName}
                </span>
              </div>

              {user.bio && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                  {user.bio}
                </p>
              )}

              <div className="flex gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Book className="w-3.5 h-3.5" />
                  <span>
                    <span className="font-medium text-gray-700">
                      {user.shelves?.completed?.length ?? 0}
                    </span>{" "}
                    books
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    <span className="font-medium text-gray-700">
                      {followerCount}
                    </span>{" "}
                    followers
                  </span>
                </div>
              </div>
            </div>

            {currentUser && currentUser.uid !== user.uid && (
              <button
                onClick={(e) => toggleFollow(e, user)}
                className={`text-white rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                  following
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {following ? "Following" : "Follow"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
