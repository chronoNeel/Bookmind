import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { searchUsers } from "../../store/slices/searchSlice";
import UserList from "./UserList";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

const UserSearchResult: React.FC = () => {
  const params = useParams<{ query: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchQuery = params.query || "";
  const { userSearchResults, isLoadingUsers } = useAppSelector(
    (state) => state.search
  );

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const totalPages = Math.ceil((userSearchResults?.length || 0) / usersPerPage);
  const currentUsers =
    userSearchResults?.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    ) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    dispatch(searchUsers(searchInput.trim()));
    navigate(`/users/${encodeURIComponent(searchInput.trim())}`);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="relative p-4 md:p-8">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2zM6 4V0H4v4H0v2h4v4h2V6h4V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto">
          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
            isLoading={isLoadingUsers}
          />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Search Results
            </h1>
            <p className="text-gray-600">
              {searchQuery ? (
                <>
                  Found{" "}
                  <span className="font-semibold">
                    {userSearchResults?.length || 0}
                  </span>{" "}
                  {userSearchResults?.length === 1 ? "user" : "users"} for&nbsp;
                  &quot;
                  {searchQuery}
                  &quot;
                </>
              ) : (
                <>Enter a search query to find users</>
              )}
            </p>
          </div>

          {isLoadingUsers && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 mx-auto border-t-transparent" />
              <p className="mt-4 text-gray-600">Searching users...</p>
            </div>
          )}

          {!isLoadingUsers &&
            userSearchResults?.length === 0 &&
            searchQuery && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600">
                  Try searching with a different query
                </p>
              </div>
            )}

          {!isLoadingUsers && currentUsers.length > 0 && (
            <>
              <UserList users={currentUsers} />
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchResult;
