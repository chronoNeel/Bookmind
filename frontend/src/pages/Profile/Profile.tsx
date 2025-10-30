import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { UserData } from "@models/user";
import api from "../../utils/api";
import ProfileHeader from "./components/ProfileHeader";
import StatsGrid from "./components/StatsGrid";
import FavoriteBooksCarousel from "./components/FavoriteBooksCarousel";
import ReadingAnalytics from "./components/ReadingAnalytics";

const Profile: React.FC = () => {
  const { userName } = useParams<{ userName?: string }>();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.user);
  const isAuthLoading = useAppSelector((state) => state.auth.loading);

  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        if (!userName) {
          if (currentUser) {
            if (isMounted) setProfileData(currentUser);
          } else {
            navigate("/login");
          }
          return;
        }

        if (currentUser && userName === currentUser.userName) {
          if (isMounted) setProfileData(currentUser);
          return;
        }

        const response = await api.get<UserData>(`/api/users/${userName}`);
        if (isMounted) setProfileData(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        if (isMounted) setProfileData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [userName, currentUser, navigate]);

  useEffect(() => {
    if (!currentUser || !profileData) {
      setIsFollowing(false);
      return;
    }
    setIsFollowing(profileData.followers.includes(currentUser.uid));
  }, [currentUser, profileData]);

  const {
    completed = [],
    wantToRead = [],
    ongoing = [],
  } = profileData?.shelves ?? {};

  const userStats = useMemo(() => {
    const completedCount = completed.length;
    const wantToReadCount = wantToRead.length;
    const ongoingCount = ongoing.length;
    const journalCount = profileData?.journals?.length ?? 0;

    return {
      wantToReadCount,
      ongoingCount,
      completedCount,
      journalCount,
    };
  }, [
    completed.length,
    wantToRead.length,
    ongoing.length,
    profileData?.journals?.length,
  ]);

  const booksReadThisYear = useMemo(() => {
    if (!completed?.length) return 0;
    const currentYear = new Date().getFullYear();
    return completed.filter((book) => {
      const bookYear = new Date(book.updatedAt).getFullYear();
      return bookYear === currentYear;
    }).length;
  }, [completed]);

  const followersCount = profileData?.followers?.length ?? 0;
  const followingCount = profileData?.following?.length ?? 0;

  const isOwnProfile = currentUser?.uid === profileData?.uid;

  // --- Handlers
  const handleFollowToggle = async () => {
    if (!currentUser || !profileData) return;

    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);

    setProfileData((prev) => {
      if (!prev) return prev;
      const alreadyFollowing = prev.followers.includes(currentUser.uid);
      return {
        ...prev,
        followers: alreadyFollowing
          ? prev.followers.filter((id) => id !== currentUser.uid)
          : [...prev.followers, currentUser.uid],
      };
    });

    try {
      await api.post(`/api/users/follow`, { targetUid: profileData.uid });
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      setIsFollowing((prev) => !prev);
      setProfileData((prev) => {
        if (!prev) return prev;
        const wasFollowing = prev.followers.includes(currentUser.uid);
        return {
          ...prev,
          followers: wasFollowing
            ? prev.followers.filter((id) => id !== currentUser.uid)
            : [...prev.followers, currentUser.uid],
        };
      });
    }
  };

  const handleFollowersClick = () => {
    if (!profileData?.uid || !userName) return;
    navigate(`/user/${userName}/followers`);
  };

  const handleFollowingClick = () => {
    if (!profileData?.uid || !userName) return;
    navigate(`/user/${userName}/following`);
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleJournalEntriesClick = () => {
    if (!profileData?.uid) return;
    navigate("/view-entries", { state: { userId: profileData.uid } });
  };

  // --- Loading state
  if (isAuthLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto" />
          <p className="mt-4 text-amber-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="text-center">
          <p className="text-xl text-amber-700 mb-2">Profile not found</p>
          <p className="text-sm text-amber-600 mb-4">
            The user @{userName ?? "unknown"} does not exist
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
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
          followers={followersCount}
          following={followingCount}
          isFollowing={isFollowing}
          isOwnProfile={isOwnProfile}
          onFollowToggle={handleFollowToggle}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
          onEditProfile={handleEditProfile}
        />

        <StatsGrid stats={userStats} />

        {(profileData.favorites?.length ?? 0) > 0 && (
          <FavoriteBooksCarousel favoriteBookKeys={profileData.favorites} />
        )}

        <ReadingAnalytics
          stats={userStats}
          yearlyGoal={profileData.stats.yearlyGoal}
          booksReadThisYear={booksReadThisYear}
          avgRating={profileData.stats.avgRating}
          onJournalEntriesClick={handleJournalEntriesClick}
        />
      </div>
    </div>
  );
};

export default Profile;
