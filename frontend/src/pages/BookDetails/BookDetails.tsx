import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import SearchBar from "../../components/SearchBar";
import BookDetailsCard from "./components/BookDetailsCard";
import SimilarBooksCarousel from "./components/SimilarBooksCarousel";
import JournalEntries from "./components/JournalEntries";
import StatusModal from "./components/StatusModal";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { mockJournalEntries } from "./components/mockData";
import { BookDetails as Book, SimilarBook } from "../../types/Book";
import { setBookStatus } from "../../store/slices/shelfSlice";
import { useAppDispatch } from "../../hooks/redux";
import { toast } from "react-toastify";
import { getBookShelf, ShelfType } from "../../utils/getBookData";
import { updateFavoriteBooks } from "../../store/slices/statsSlice";

const BookDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams<{ bookKey: string }>();
  const { bookKey } = params;
  if (!bookKey) throw new Error("Missing :bookKey in route");

  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<string>("Unknown Author");
  const [description, setDescription] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [similarBooks, setSimilarBooks] = useState<SimilarBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<ShelfType | null>(null);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const coverUrl = useMemo(() => {
    if (!book?.covers?.length) return null;
    return `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
  }, [book?.covers]);

  // Initialize status based on which shelf the book is in
  useEffect(() => {
    if (!bookKey || !currentUser?.shelves) return;

    const shelf = getBookShelf({
      shelves: currentUser.shelves,
      bookKey,
    });
    setStatus(shelf);
  }, [currentUser?.shelves, bookKey]);

  // Initialize favorite status from user's favorites
  useEffect(() => {
    if (currentUser?.favorites && bookKey) {
      setIsFavorite(currentUser.favorites.includes(bookKey));
    }
  }, [currentUser?.favorites, bookKey]);

  useEffect(() => {
    const getBookDetails = async () => {
      if (!bookKey) {
        setError("No book key provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch book details
        const bookResponse = await axios.get(
          `https://openlibrary.org${bookKey}.json`
        );
        const bookData = bookResponse.data;
        setBook(bookData);

        // Set description
        const desc =
          typeof bookData.description === "object"
            ? bookData.description.value
            : bookData.description || "No description available";
        setDescription(desc);

        // Set genres
        const subjects: string[] = bookData.subjects || [];
        setGenres(subjects.slice(0, 5));

        // Fetch author details
        if (bookData.authors?.length) {
          try {
            const authorKey = bookData.authors[0].author.key;
            const authorResponse = await axios.get(
              `https://openlibrary.org${authorKey}.json`
            );
            setAuthor(authorResponse.data.name || "Unknown Author");
          } catch (authorError: unknown) {
            console.error("Error fetching author:", authorError);
            setAuthor("Unknown Author");
          }
        } else {
          setAuthor("Unknown Author");
        }

        // Fetch similar books
        const uniqueBooks = new Map<string, SimilarBook>();
        const maxSubjects = 3;
        const limitPerSubject = 5;

        for (const subject of subjects.slice(0, maxSubjects)) {
          const searchUrl = `https://openlibrary.org/search.json?q=subject:${encodeURIComponent(
            subject
          )}&limit=${limitPerSubject + 2}&fields=title,author_name,key,cover_i`;

          const searchResponse = await axios.get(searchUrl);

          (searchResponse.data.docs as Array<Record<string, unknown>>)
            .filter((doc) => typeof doc.key === "string" && doc.key !== bookKey)
            .forEach((doc) => {
              const key = doc.key as string;
              if (!uniqueBooks.has(key)) {
                uniqueBooks.set(key, {
                  title: doc.title as string,
                  author: Array.isArray(doc.author_name)
                    ? (doc.author_name[0] as string)
                    : "Unknown",
                  workKey: key,
                  coverUrl:
                    typeof doc.cover_i === "number"
                      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                      : null,
                  subject,
                });
              }
            });
        }

        setSimilarBooks(Array.from(uniqueBooks.values()).slice(0, 20));
      } catch (err: unknown) {
        const error = err as AxiosError;
        console.error("Error fetching data:", error);
        setError("Failed to load book details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getBookDetails();
  }, [bookKey]);

  const handleStatusChange = async (
    newStatus: "wantToRead" | "ongoing" | "completed" | "remove"
  ) => {
    if (!book?.key) return;

    if (!currentUser) {
      setIsModalOpen(false);
      toast.warn("Please log in to add books to your shelves.", {
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/login", { state: { from: `/book/${bookKey}` } });
      }, 1500);
      return;
    }

    try {
      const statusValue = newStatus === "remove" ? null : newStatus;

      await dispatch(
        setBookStatus({ bookKey: book.key, status: statusValue })
      ).unwrap();

      setStatus(statusValue);

      const toasterText =
        statusValue === null
          ? "removed from your shelves"
          : `Added to ${
              statusValue === "wantToRead"
                ? "Want to Read"
                : statusValue === "ongoing"
                ? "Ongoing"
                : "Completed"
            } shelf`;

      toast.success(toasterText);
      setIsModalOpen(false);
    } catch (error: unknown) {
      if (typeof error === "object" && error && "code" in error) {
        const err = error as { code?: string; message?: string };
        if (err.code === "AUTH_REQUIRED") {
          setIsModalOpen(false);
          const shouldRedirect = window.confirm(
            err.message || "Please log in to continue. Redirect to login?"
          );
          if (shouldRedirect) {
            navigate("/login", { state: { from: `/book/${bookKey}` } });
          }
        }
      } else {
        alert("Failed to update book status. Please try again.");
      }
    }
  };

  const handleAddJournal = () => {
    if (!currentUser) {
      alert("Please log in to add journal entries");
      navigate("/login", { state: { from: `/book/${bookKey}` } });
      return;
    }

    if (book) {
      navigate("/add-journal", { state: { bookKey: book.key } });
    }
  };

  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      toast.warn("Please log in to manage favorites.", {
        position: "top-center",
      });
      navigate("/login", { state: { from: `/book/${bookKey}` } });
      return;
    }

    try {
      const result = await dispatch(updateFavoriteBooks({ bookKey })).unwrap();
      const isNowFavorite = result.favorites.includes(bookKey);
      setIsFavorite(isNowFavorite);

      toast.success(
        isNowFavorite ? "Added to favorites!" : "Removed from favorites!",
        { position: "top-center" }
      );
    } catch (error: unknown) {
      if (typeof error === "object" && error && "code" in error) {
        const err = error as { code?: string; message?: string };
        if (err.code === "AUTH_REQUIRED") {
          const shouldRedirect = window.confirm(
            err.message || "Please log in to continue. Redirect to login?"
          );
          if (shouldRedirect) {
            navigate("/login", { state: { from: `/book/${bookKey}` } });
          }
        }
      } else {
        toast.error("Failed to update favorites. Please try again.", {
          position: "top-center",
        });
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !book) {
    return <ErrorMessage error={error} onGoBack={() => navigate("/")} />;
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />{" "}
        <SearchBar />
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
          <BookDetailsCard
            book={book}
            author={author}
            coverUrl={coverUrl}
            description={description}
            genres={genres}
            isFavorite={isFavorite}
            status={status}
            onFavoriteToggle={handleFavoriteToggle}
            onStatusClick={() => setIsModalOpen(true)}
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
          book={book}
          author={author}
          currentStatus={status}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default BookDetails;
