import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  addBookToShelf,
  removeBookFromShelf,
} from "../../store/slices/shelfSlice";
import SearchBar from "../../components/SearchBar";
import BookDetailsCard from "./components/BookDetailsCard";
import SimilarBooksCarousel from "./components/SimilarBooksCarousel";
import JournalEntries from "./components/JournalEntries";
import StatusModal from "./components/StatusModal";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { mockJournalEntries } from "./components/mockData";
import { BookDetails as Book, SimilarBook } from "../../types/Book";

const BookDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams<{ bookKey: string }>();
  const { bookKey } = params;

  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<string>("Unknown Author");
  const [description, setDescription] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [similarBooks, setSimilarBooks] = useState<SimilarBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shelves = useSelector((state: RootState) => state.shelf);
  const [status, setStatus] = useState<
    "wantToRead" | "ongoing" | "completed" | null
  >(null);

  const coverUrl = useMemo(() => {
    if (!book?.covers?.length) return null;
    return `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
  }, [book?.covers]);

  // Initialize status based on which shelf the book is in
  useEffect(() => {
    if (!book?.key) return;

    if (shelves.completed.includes(book.key)) {
      setStatus("completed");
    } else if (shelves.ongoing.includes(book.key)) {
      setStatus("ongoing");
    } else if (shelves.wantToRead.includes(book.key)) {
      setStatus("wantToRead");
    } else {
      setStatus(null);
    }
  }, [shelves, book?.key]);

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
          } catch (authorError) {
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

          (searchResponse.data.docs as any[])
            .filter((doc) => doc.key && doc.key !== bookKey)
            .forEach((doc) => {
              const key = doc.key;
              if (!uniqueBooks.has(key)) {
                uniqueBooks.set(key, {
                  title: doc.title,
                  author: doc.author_name ? doc.author_name[0] : "Unknown",
                  workKey: doc.key,
                  coverUrl: doc.cover_i
                    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                    : null,
                  subject,
                });
              }
            });
        }

        setSimilarBooks(Array.from(uniqueBooks.values()).slice(0, 20));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load book details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getBookDetails();
  }, [bookKey]);

  const handleStatusChange = (
    newStatus: "wantToRead" | "ongoing" | "completed" | "remove"
  ) => {
    if (!book?.key) return;

    if (newStatus === "remove") {
      dispatch(removeBookFromShelf(book.key));
      setStatus(null);
    } else {
      dispatch(addBookToShelf({ shelf: newStatus, bookKey: book.key }));
      setStatus(newStatus);
    }
    setIsModalOpen(false);
  };

  const handleAddJournal = () => {
    if (book) {
      navigate("/add-journal", { state: { bookKey: book.key } });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !book) {
    return <ErrorMessage error={error} onGoBack={() => navigate("/")} />;
  }

  return (
    <>
      <div className="min-vh-100 position-relative overflow-hidden text-dark p-3 p-md-4 bg-gradient-to-br from-amber-50 to-orange-50">
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
            onFavoriteToggle={() => setIsFavorite(!isFavorite)}
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
