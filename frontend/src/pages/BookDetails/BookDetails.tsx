import React, { useState, useEffect, useMemo } from "react";
import {
  Heart,
  BookOpen,
  Plus,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  Star,
  ChevronDown,
  X,
} from "lucide-react";
import SearchBar from "../../components/SearchBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  addBookToShelf,
  removeBookFromShelf,
} from "../../store/slices/shelfSlice";

const mockJournalEntries = [
  {
    id: 1,
    user: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
    rating: 5,
    date: "October 15, 2025",
    text: "This book completely changed my perspective on the American Dream. Fitzgerald's prose is absolutely stunning, and the way he captures the decadence and emptiness of the Jazz Age is masterful. Gatsby himself is such a tragic figure - his unwavering hope in the face of impossible odds is both inspiring and heartbreaking.",
    upvotes: 45,
    downvotes: 2,
  },
  {
    id: 2,
    user: { name: "Michael Chen", avatar: "https://i.pravatar.cc/150?img=2" },
    rating: 4,
    date: "October 12, 2025",
    text: "Beautiful writing, though I found Nick to be an unreliable narrator at times. The symbolism with the green light is something I'll never forget. A must-read for anyone interested in American literature.",
    upvotes: 32,
    downvotes: 5,
  },
  {
    id: 3,
    user: { name: "Emma Williams", avatar: "https://i.pravatar.cc/150?img=3" },
    rating: 5,
    date: "October 8, 2025",
    text: "Reread this for the third time and discovered new layers each time. The contrast between old money and new money, the role of women in the 1920s, and the critique of capitalism are all brilliantly woven into the narrative.",
    upvotes: 28,
    downvotes: 1,
  },
];

interface SimilarBook {
  title: string;
  author: string;
  workKey: string;
  coverUrl: string | null;
  subject: string;
}

export interface Book {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  authors?: { author: { key: string } }[];
}

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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const shelves = useSelector((state: RootState) => state.shelf);
  const [status, setStatus] = useState<
    "wantToRead" | "ongoing" | "completed" | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
    { value: "wantToRead", label: "Want to Read" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "remove", label: "Remove from Shelf" },
  ];

  const statusColors = {
    wantToRead:
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    ongoing:
      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
    completed:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
  };

  const statusLabels = {
    wantToRead: "Want to Read",
    ongoing: "Ongoing",
    completed: "Completed",
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return statusColors.wantToRead;
    return (
      statusColors[status as keyof typeof statusColors] ||
      statusColors.wantToRead
    );
  };

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

  const handleStatusChange = (
    newStatus: "wantToRead" | "ongoing" | "completed" | "remove"
  ) => {
    if (!book?.key) return;

    if (newStatus === "remove") {
      dispatch(removeBookFromShelf(book.key));
      setStatus(null);
    } else {
      dispatch(
        addBookToShelf({
          shelf: newStatus,
          bookKey: book.key,
        })
      );
      setStatus(newStatus);
    }
    setIsModalOpen(false);
  };

  const coverUrl = useMemo(() => {
    if (!book?.covers?.length) return null;
    return `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
  }, [book?.covers]);

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

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => Math.min(similarBooks.length - 3, prev + 1));
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-gray-300"
        }
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-amber-600" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <p className="text-danger">{error || "Book not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary mt-3"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-vh-100 position-relative overflow-hidden text-dark p-3 p-md-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <SearchBar />

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
          <div className="bg-white rounded-3xl shadow-md p-8 mb-12">
            <div className="grid md:grid-cols-[300px_1fr] gap-8">
              {/* Cover */}
              <div className="flex justify-center md:justify-start shrink-0">
                <div className="w-72">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="w-full rounded-2xl shadow-2xl transition-transform hover:scale-105 object-cover aspect-[2/3]"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-100 flex items-center justify-center rounded-2xl shadow-inner text-gray-400">
                      No cover available
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-4xl font-bold text-gray-900 break-words">
                    {book.title}
                  </h1>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`shrink-0 p-3 rounded-full transition-all duration-300 ${
                      isFavorite
                        ? "text-red-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <Heart
                      className={`w-6 h-6 transition-all ${
                        isFavorite ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>

                <p className="text-lg text-amber-800 font-medium">{author}</p>

                <div className="flex flex-wrap gap-2">
                  {genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 rounded-full text-sm font-medium shadow-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <p
                  className={`text-gray-700 leading-relaxed ${
                    !showFullDescription ? "line-clamp-3" : ""
                  }`}
                >
                  {description}
                </p>
                {description.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-amber-600 hover:text-amber-800 mt-2 font-medium transition-colors"
                  >
                    {showFullDescription ? "Show Less" : "Read More →"}
                  </button>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {/* Status Button */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${getStatusColor(
                      status
                    )}`}
                  >
                    <span>
                      {status ? statusLabels[status] : "Add to Shelf"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <button
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => {
                      console.log(book);
                      navigate("/add-journal", {
                        state: { bookKey: book.key },
                      });
                    }}
                  >
                    Add Journal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Books */}
          {similarBooks.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ✨ Similar Books
              </h2>
              <div className="relative bg-white rounded-3xl shadow-lg p-8 overflow-hidden">
                <div
                  className="flex gap-6 transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${carouselIndex * 220}px)` }}
                >
                  {similarBooks.map((similarBook, idx) => (
                    <div
                      key={`${similarBook.workKey}-${idx}`}
                      className="flex-shrink-0 w-48 cursor-pointer group"
                      onClick={() =>
                        navigate(
                          `/book/${encodeURIComponent(similarBook.workKey)}`
                        )
                      }
                    >
                      {similarBook.coverUrl ? (
                        <img
                          src={similarBook.coverUrl}
                          alt={similarBook.title}
                          className="w-full h-72 object-cover rounded-xl shadow-md group-hover:scale-105 transition-all"
                        />
                      ) : (
                        <div className="w-full h-72 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                      <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">
                        {similarBook.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {similarBook.author}
                      </p>
                    </div>
                  ))}
                </div>

                {carouselIndex > 0 && (
                  <button
                    onClick={handlePrevCarousel}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-amber-50 transition-colors"
                  >
                    <ChevronLeft size={24} className="text-amber-700" />
                  </button>
                )}
                {carouselIndex < similarBooks.length - 3 && (
                  <button
                    onClick={handleNextCarousel}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-amber-50 transition-colors"
                  >
                    <ChevronRight size={24} className="text-amber-700" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Journal Entries */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              📝 Journal Entries
            </h2>
            <div className="space-y-6">
              {mockJournalEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={entry.user.avatar}
                      alt={entry.user.name}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {entry.user.name}
                          </h3>
                          <p className="text-sm text-gray-600">{entry.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(entry.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {entry.text}
                      </p>
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors">
                          <ThumbsUp size={18} />
                          <span className="font-medium">{entry.upvotes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                          <ThumbsDown size={18} />
                          <span className="font-medium">{entry.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Selection Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Update Reading Status
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Book Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold text-gray-900 mb-1">{book.title}</p>
              <p className="text-sm text-gray-600">{author}</p>
            </div>

            {/* Status Options */}
            <div className="space-y-3">
              {statusOptions.map((option) => {
                const isRemoveOption = option.value === "remove";
                const isCurrentStatus = status === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleStatusChange(
                        option.value as
                          | "wantToRead"
                          | "ongoing"
                          | "completed"
                          | "remove"
                      )
                    }
                    className={`w-full text-left px-5 py-4 rounded-xl font-medium transition-all duration-300 ${
                      isRemoveOption
                        ? "bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200"
                        : isCurrentStatus
                        ? getStatusColor(option.value) + " text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    disabled={isRemoveOption && status === null}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {isCurrentStatus && !isRemoveOption && (
                        <span className="text-sm">✓ Current</span>
                      )}
                      {isRemoveOption && status === null && (
                        <span className="text-sm opacity-50">Not on shelf</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookDetails;
