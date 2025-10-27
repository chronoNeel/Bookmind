import React from "react";
import { Book, Users, UserCheck, UserPlus } from "lucide-react";
import { UserData } from "../../models/user";

interface Props {
  user: UserData;
  following: boolean;
  followerCount: number;
  currentUser: UserData;
  onToggleFollow: (e: React.MouseEvent, user: UserData) => void;
  onClick: () => void;
}

const FollowCard: React.FC<Props> = ({
  user,
  following,
  followerCount,
  currentUser,
  onToggleFollow,
  onClick,
}) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
  >
    <div className="p-6">
      <div className="flex flex-col items-center text-center mb-4">
        <img
          src={user.profilePic || "/default-avatar.png"}
          alt={user.fullName}
          className="rounded-full w-20 h-20 object-cover border-3 border-gray-100 mb-3 group-hover:scale-105 transition-transform duration-300"
        />
        <h3 className="text-lg font-bold text-gray-900 truncate w-full">
          {user.fullName}
        </h3>
        <p className="text-sm text-gray-500 truncate w-full">
          @{user.userName}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Book className="w-4 h-4 text-amber-600" />
          <span className="font-medium">
            {user.shelves?.completed?.length ?? 0}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-amber-600" />
          <span className="font-medium">{followerCount}</span>
        </div>
      </div>

      {currentUser && currentUser.uid !== user.uid && (
        <button
          onClick={(e) => onToggleFollow(e, user)}
          className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
            following
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
          }`}
        >
          {following ? (
            <>
              <UserCheck size={20} /> Following
            </>
          ) : (
            <>
              <UserPlus size={20} /> Follow
            </>
          )}
        </button>
      )}
    </div>
  </div>
);

export default FollowCard;
