import React from "react";
import { Users } from "lucide-react";

interface Props {
  fullName: string;
  profilePic: string;
  userName: string;
  count: number;
  type: "followers" | "following";
}

const FollowHeader: React.FC<Props> = ({
  fullName,
  profilePic,
  userName,
  count,
  type,
}) => (
  <div className="bg-white rounded-3xl shadow-md p-8 sm:p-12 mb-8 border border-gray-100 text-center">
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <img
          src={profilePic || "/default-avatar.png"}
          alt={fullName}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-amber-100 shadow-md"
        />
        <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-3 shadow-lg">
          <Users className="w-5 h-5 text-white" />
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        {fullName}
      </h1>
      <p className="text-lg text-gray-500 mb-6">@{userName}</p>
      <div>
        <p className="text-3xl font-bold text-amber-600">{count}</p>
        <p className="text-sm text-gray-600 font-medium mt-1">
          {type === "followers" ? "Followers" : "Following"}
        </p>
      </div>
    </div>
  </div>
);

export default FollowHeader;
