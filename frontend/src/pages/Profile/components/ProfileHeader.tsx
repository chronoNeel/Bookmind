// ProfileHeader.tsx
import React from "react";
import { Edit3, UserPlus, UserCheck, Users } from "lucide-react";

interface ProfileHeaderProps {
  userName: string;
  fullName: string;
  bio: string;
  profilePic: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
  onFollowToggle: () => void;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
  onEditProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  fullName,
  bio,
  profilePic,
  followers,
  following,
  isFollowing,
  isOwnProfile,
  onFollowToggle,
  onFollowersClick,
  onFollowingClick,
  onEditProfile,
}) => {
  // Fallback profile picture
  const displayProfilePic = profilePic;

  return (
    <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden mb-8">
      <div className="px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-2xl ring-4 ring-amber-200">
            <img
              src={displayProfilePic}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-3 gap-4">
              <div>
                {/* Name and Username */}
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                  {fullName}
                </h1>
                <p className="text-gray-500 text-lg mb-2">@{userName}</p>

                {/* Followers/Following */}
                <div className="flex justify-center sm:justify-start gap-6 mb-3">
                  <button
                    onClick={onFollowersClick}
                    className="flex items-center gap-2 hover:text-amber-600 transition-colors"
                  >
                    <Users size={18} />
                    <span className="font-semibold">{followers}</span>
                    <span className="text-sm text-gray-600">Followers</span>
                  </button>
                  <button
                    onClick={onFollowingClick}
                    className="flex items-center gap-2 hover:text-amber-600 transition-colors"
                  >
                    <Users size={18} />
                    <span className="font-semibold">{following}</span>
                    <span className="text-sm text-gray-600">Following</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwnProfile ? (
                  <button
                    onClick={onEditProfile}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Edit3 size={20} /> Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={onFollowToggle}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${
                      isFollowing
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                    }`}
                  >
                    {isFollowing ? (
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

            {/* Bio */}
            <p className="text-gray-600 max-w-2xl mx-auto sm:mx-0">
              {bio || "No bio yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
