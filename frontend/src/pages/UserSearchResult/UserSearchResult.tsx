import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  UserPlus,
  UserCheck,
  Book,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { demoUsers } from "../../assets/demoUsers";

interface User {
  id: number;
  username: string;
  fullName: string;
  profilePicture: string;
  readBooks: number;
  followers: number;
  isFollowing: boolean;
  bio: string;
}

interface FollowingState {
  [key: number]: boolean;
}

const UserSearchResult: React.FC = () => {
  const params = useParams<{ query: string }>();
  const searchQuery = params.query || "";

  const [followingState, setFollowingState] = useState<FollowingState>(() => {
    const state: FollowingState = {};
    demoUsers.forEach((user: User) => {
      state[user.id] = user.isFollowing;
    });
    return state;
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 8;

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return demoUsers;

    const query = searchQuery.toLowerCase();
    return demoUsers.filter(
      (user: User) =>
        user.username.toLowerCase().includes(query) ||
        user.fullName.toLowerCase().includes(query) ||
        user.bio.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleFollowToggle = (userId: number): void => {
    setFollowingState((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="relative p-4 md:p-8">
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Search Results
            </h1>
            <p className="text-gray-600">
              {searchQuery && (
                <>
                  Found{" "}
                  <span className="font-semibold">{filteredUsers.length}</span>{" "}
                  {filteredUsers.length === 1 ? "user" : "users"} for "
                  {searchQuery}"
                </>
              )}
              {!searchQuery && <>Showing all users</>}
            </p>
          </div>

          {/* Results */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">Try adjusting your search query</p>
            </div>
          ) : (
            <>
              {/* User Cards - Row Layout */}
              <div className="space-y-4 mb-8">
                {currentUsers.map((user: User) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden"
                  >
                    <div className="p-5 flex items-center gap-4">
                      {/* Profile Picture */}
                      <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        className="rounded-full w-16 h-16 object-cover flex-shrink-0 border-2 border-gray-100"
                      />

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {user.fullName}
                          </h3>
                          <span className="text-sm text-gray-500 truncate">
                            @{user.username}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                          {user.bio}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Book className="w-3.5 h-3.5" />
                            <span>
                              <span className="font-medium text-gray-700">
                                {user.readBooks}
                              </span>{" "}
                              books
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>
                              <span className="font-medium text-gray-700">
                                {user.followers.toLocaleString()}
                              </span>{" "}
                              followers
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Follow Button */}
                      <button
                        onClick={() => handleFollowToggle(user.id)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex-shrink-0 ${
                          followingState[user.id]
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {followingState[user.id] ? "Following" : "Follow"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          aria-label={`Go to page ${page}`}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchResult;
