import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "@store";
import { useBookData } from "@hooks/useBookData";
import { useSimilarBooks } from "@hooks/useSimilarBooks";
import { useBookStatus } from "@hooks/useBookStatus";
import SearchBar from "@components/SearchBar";
import BookDetailsCard from "./components/BookDetailsCard";
import SimilarBooksCarousel from "./components/SimilarBooksCarousel";
import JournalEntries from "./components/JournalEntries";
import StatusModal from "@components/StatusModal";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { mockJournalEntries } from "./components/mockData";
import { useBookFavorite } from "@/hooks/useBookFavorites";

const BookDetails = () => {
  const navigate = useNavigate();
  const { bookKey } = useParams();

  if (!bookKey) throw new Error("Missing :bookKey in route");

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { title, authors, coverUrl, description, genres, loading, error } =
    useBookData(bookKey);
  const { similarBooks } = useSimilarBooks(bookKey, genres);
  const { status, isModalOpen, handleStatusChange, openModal, closeModal } =
    useBookStatus(bookKey);
  const { isFavorite, handleFavoriteToggle } = useBookFavorite(bookKey);

  const handleAddJournal = () => {
    if (!currentUser) {
      toast.warn("Please log in to add journal entries", {
        position: "top-center",
      });
      setTimeout(
        () => navigate("/login", { state: { from: `/book/${bookKey}` } }),
        1500
      );
      return;
    }
    navigate("/add-journal", { state: { bookKey } });
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage error={error} onGoBack={() => navigate("/")} />;

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <SearchBar />

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
          <BookDetailsCard
            title={title}
            authors={authors.join(", ")}
            coverUrl={coverUrl}
            description={description}
            genres={genres}
            isFavorite={isFavorite}
            status={status}
            onFavoriteToggle={handleFavoriteToggle}
            onStatusClick={openModal}
            onAddJournal={handleAddJournal}
          />

          {similarBooks.length > 0 && (
            <SimilarBooksCarousel
              similarBooks={similarBooks}
              onBookClick={(workKey) =>
                navigate(`/book/${encodeURIComponent(workKey)}`)
              }
            />
          )}

          <JournalEntries entries={mockJournalEntries} />
        </div>
      </div>

      {isModalOpen && (
        <StatusModal
          title={title}
          authors={authors.join(", ")}
          currentStatus={status}
          onClose={closeModal}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default BookDetails;
