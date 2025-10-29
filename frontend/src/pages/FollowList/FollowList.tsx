import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2, Users } from "lucide-react";
import { useAppSelector } from "../../hooks/redux";
import { UserData } from "@models/user";
import api from "../../utils/api";
import FollowHeader from "./FollowHeader";
import FollowSearch from "./FollowSearch";
import FollowGrid from "./FollowGrid";
import Pagination from "./Pagination";

const FollowList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((s) => s.auth.user);
  const { userName } = useParams();

  const type = location.pathname.endsWith("followers")
    ? "followers"
    : "following";

  const [followList, setFollowList] = useState<UserData[]>([]);
  const [filteredList, setFilteredList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followingStates, setFollowingStates] = useState<
    Record<string, boolean>
  >({});
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>(
    {}
  );
  const [fullName, setFullName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  // Fetch user and their followers/following
  useEffect(() => {
    const fetchFollowList = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userName) return;
        const response = await api.get(`/api/users/${userName}`);
        const userData = response?.data;
        if (!userData) throw new Error("User not found");

        setFullName(userData.fullName);
        setProfilePic(userData.profilePic);

        const userIds =
          type === "followers"
            ? userData.followers ?? []
            : userData.following ?? [];

        if (userIds.length === 0) {
          setFollowList([]);
          setFilteredList([]);
          return;
        }

        const userDataResponses = await Promise.all(
          userIds.map((uid: string) =>
            api.get(`/api/users/user/id/${uid}`).catch(() => null)
          )
        );

        const users = userDataResponses
          .filter((res) => res?.data?.user)
          .map((res) => res!.data.user as UserData);

        setFollowList(users);
        setFilteredList(users);
      } catch (err) {
        console.error(err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowList();
  }, [userName, type]);

  // Search filter
  useEffect(() => {
    const filtered = followList.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchQuery, followList]);

  const isFollowing = (id: string) =>
    followingStates[id] ?? currentUser?.following?.includes(id) ?? false;

  const getFollowerCount = (user: UserData) =>
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
      console.error(error);
      setFollowingStates((prev) => ({ ...prev, [targetUid]: !nextFollowing }));
      setFollowerCounts((prev) => ({
        ...prev,
        [targetUid]: getFollowerCount(targetUser) - (nextFollowing ? 1 : -1),
      }));
    }
  };

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md shadow-lg">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <FollowHeader
          fullName={fullName}
          profilePic={profilePic}
          userName={userName!}
          count={followList.length}
          type={type}
        />

        <FollowSearch
          value={searchQuery}
          onChange={setSearchQuery}
          type={type}
        />

        {filteredList.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              {searchQuery
                ? "No users found matching your search"
                : `No ${type === "followers" ? "followers" : "following"} yet`}
            </p>
          </div>
        ) : (
          <>
            <FollowGrid
              users={currentItems}
              currentUser={currentUser}
              isFollowing={isFollowing}
              getFollowerCount={getFollowerCount}
              toggleFollow={toggleFollow}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FollowList;
