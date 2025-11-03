import { useState, useEffect, useMemo } from "react";
import SearchBar from "./components/SearchBar";
import JournalCard from "./components/JournalCard";
import Pagination from "@components/Pagination";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { RootState } from "@store";
import {
  fetchJournalByUserId,
  fetchPublicJournals,
} from "@store/slices/journalSlice";
import { fetchUserProfile } from "@store/slices/userSlice";
import { useParams } from "react-router-dom";
import NoJournals from "./components/NoJournals";
import SortControl from "./components/SortControls";

const ITEMS_PER_PAGE = 6;

const AllJournalsFeed = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { publicJournals, userJournals, loading, error } = useAppSelector(
    (state: RootState) => state.journal
  );
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "votes">("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    if (userId) dispatch(fetchJournalByUserId(userId));
    else dispatch(fetchPublicJournals());
  }, [dispatch, userId]);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;
      try {
        const userData = await dispatch(fetchUserProfile(userId)).unwrap();
        setUserFullName(userData.fullName);
      } catch {
        setUserFullName("");
      }
    };
    loadUser();
  }, [dispatch, userId]);

  const allJournals = useMemo(() => {
    if (userId) {
      if (currentUser?.uid === userId) return userJournals;
      return userJournals.filter((j) => !j.isPrivate);
    }
    return publicJournals;
  }, [userId, userJournals, publicJournals, currentUser]);

  const filteredJournals = useMemo(() => {
    return allJournals.filter((j) =>
      j.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allJournals, searchTerm]);

  const sortedJournals = useMemo(() => {
    return [...filteredJournals].sort((a, b) => {
      if (sortBy === "recent")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return (
        b.upvotedBy.length -
        b.downvotedBy.length -
        (a.upvotedBy.length - a.downvotedBy.length)
      );
    });
  }, [filteredJournals, sortBy]);

  const totalPages = Math.ceil(sortedJournals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJournals = sortedJournals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, searchTerm]);

  const displayTitle = userId
    ? `${userFullName ? `${userFullName}'s` : "User's"} Journals`
    : "Journal Feed";

  return (
    <div
      className="min-vh-100 position-relative overflow-hidden text-dark p-3 p-md-4"
      style={{ background: "linear-gradient(135deg, #fffaea 50%)" }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          pointerEvents: "none",
          opacity: 0.3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' ... %3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-serif text-slate-900">{displayTitle}</h1>
          <div className="flex items-center gap-3">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <SortControl sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {!loading && sortedJournals.length === 0 && !error && <NoJournals />}

        {!loading && sortedJournals.length > 0 && (
          <>
            <div className="space-y-6 mt-6">
              {currentJournals.map((entry) => (
                <JournalCard key={entry.id} entry={entry} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        <div className="h-24" aria-hidden />
      </div>
    </div>
  );
};

export default AllJournalsFeed;
