import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { UserData } from "../../models/user";
import api from "../../utils/api";
import ProfileHeader from "./components/ProfileHeader";
import StatsGrid from "./components/StatsGrid";
import FavoriteBooksCarousel from "./components/FavoriteBooksCarousel";
import ReadingAnalytics from "./components/ReadingAnalytics";

const Profile = () => {
  const { user: userParam } = useParams<{ user: string }>();
  const navigate = useNavigate();

  // Get current user from Redux
  const currentUser = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.loading);

  // State for viewed profile - properly typed as UserData | null
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // If viewing own profile or no userParam specified, use current user
        if (!userParam || userParam === currentUser?.userName) {
          setProfileData(currentUser);
        } else {
          // Fetch other user's profile data by username
          // You'll need to add this endpoint to your backend
          const response = await api.get(`/api/users/username/${userParam}`);
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // If user not found, redirect to home or show error
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [userParam, currentUser, navigate]);

  useEffect(() => {
    // Check if current user is following this profile
    if (currentUser && profileData && profileData.uid !== currentUser.uid) {
      setIsFollowing(currentUser.following.includes(profileData.uid));
    }
  }, [currentUser, profileData]);

  const handleFollowToggle = async () => {
    if (!currentUser || !profileData) return;

    try {
      await api.post(`/api/users/follow`, {
        targetUid: profileData.uid,
      });

      setIsFollowing(!isFollowing);

      // Update the follower/following counts locally
      if (!isFollowing) {
        setProfileData({
          ...profileData,
          followers: [...profileData.followers, currentUser.uid],
        });
      } else {
        setProfileData({
          ...profileData,
          followers: profileData.followers.filter(
            (id) => id !== currentUser.uid
          ),
        });
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  const handleFollowersClick = () => {
    navigate(`/followers`, { state: { userId: profileData?.uid } });
  };

  const handleFollowingClick = () => {
    navigate(`/followings`, { state: { userId: profileData?.uid } });
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleJournalEntriesClick = () => {
    navigate("/view-entries", { state: { userId: profileData?.uid } });
  };

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If no profile data found
  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="text-center">
          <p className="text-xl text-amber-700">Profile not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Transform user data for components
  const stats = {
    wantToRead: profileData.stats.wantToReadCount,
    currentlyReading: profileData.stats.ongoingCount,
    read: profileData.stats.completedCount,
    journalEntries: profileData.stats.totalJournals,
  };

  const followers = profileData.followers.length;
  const following = profileData.following.length;

  // Check if viewing own profile
  const isOwnProfile = currentUser?.uid === profileData.uid;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <ProfileHeader
          userName={profileData.userName}
          fullName={profileData.fullName}
          bio={profileData.bio}
          profilePic={profileData.profilePic}
          followers={followers}
          following={following}
          isFollowing={isFollowing}
          isOwnProfile={isOwnProfile}
          onFollowToggle={handleFollowToggle}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
          onEditProfile={handleEditProfile}
        />

        <StatsGrid stats={stats} />

        {profileData.favorites.length > 0 && (
          <FavoriteBooksCarousel favoriteBookKeys={profileData.favorites} />
        )}

        <ReadingAnalytics
          stats={stats}
          yearlyGoal={profileData.stats.yearlyGoal}
          booksReadThisYear={profileData.stats.booksReadThisYear.length}
          avgRating={profileData.stats.avgRating}
          onJournalEntriesClick={handleJournalEntriesClick}
        />
      </div>
    </div>
  );
};

export default Profile;
