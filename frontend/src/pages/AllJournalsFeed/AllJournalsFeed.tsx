import { useState, useEffect } from "react";
import SortControls from "./components/SortControls";
import JournalCard from "./components/JournalCard";
import Pagination from "./components/Pagination";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { RootState } from "../../store";
import { fetchPublicJournals } from "../../store/slices/journalSlice";

const ITEMS_PER_PAGE = 9;

const AllJournalsFeed = () => {
  const dispatch = useAppDispatch();
  const { publicJournals, loading, error } = useAppSelector(
    (state: RootState) => state.journal
  );

  const [sortBy, setSortBy] = useState<"recent" | "rating" | "votes">("recent");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPublicJournals());
  }, [dispatch]);

  const sortedJournals = [...publicJournals].sort((a, b) => {
    if (sortBy === "recent")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return (
      b.upvotedBy.length -
      b.downvotedBy.length -
      (a.upvotedBy.length - a.downvotedBy.length)
    );
  });

  const totalPages = Math.ceil(sortedJournals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJournals = sortedJournals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8 relative">
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 4V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        <SortControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalEntries={sortedJournals.length}
        />

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

        {!loading && sortedJournals.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-amber-200">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              No Public Journals Yet
            </h3>
            <p className="text-amber-700">
              Be the first to share your reading journey with the community!
            </p>
          </div>
        )}

        {!loading && sortedJournals.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
              {currentJournals.map((entry) => (
                <JournalCard key={entry.id} entry={entry} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <div className="mt-4 text-center text-sm text-amber-700">
              Showing {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, sortedJournals.length)} of{" "}
              {sortedJournals.length} entries
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllJournalsFeed;
