import React, { useEffect, useMemo, useState } from "react";
import { Book } from "../../../types/Book";
import { ChevronDown, Plus, BookOpen, Edit3, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../utils/getUserData";
import { getBookShelf, ShelfType } from "../../../utils/getBookData";
import StatusModal from "../../BookDetails/components/StatusModal";
import { useAppDispatch } from "../../../hooks/redux";
import { toast } from "react-toastify";
import { setBookStatus } from "../../../store/slices/shelfSlice";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = getCurrentUser();
  const [status, setStatus] = useState<ShelfType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState<string>("Unknown Author");

  const coverUrl = useMemo(() => {
    if (!book?.cover_i) return undefined;
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  }, []);

  useEffect(() => {
    if (!book || !currentUser?.shelves) return;

    const shelf = getBookShelf({
      shelves: currentUser.shelves,
      bookKey: book.key,
    });

    setStatus(shelf);
  }, [currentUser?.shelves, book.key]);

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

  useEffect(() => {
    const getDescription = async () => {
      try {
        const bookResponse = await axios.get(
          `https://openlibrary.org${book.key}.json`
        );
        const bookData = bookResponse.data;

        const desc =
          typeof bookData.description === "object"
            ? bookData.description.value
            : bookData.description || "No description available";
        setDescription(desc);

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
      } catch (err) {
        console.error("Failed to fetch description:", err);
        setDescription("No description available");
      }
    };

    getDescription();
  }, [book.key]);

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
        navigate("/login", { state: { from: `/book/${book.key}` } });
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

      toast.success(`${toasterText}`);
      setIsModalOpen(false);
    } catch (error: any) {
      if (error?.code === "AUTH_REQUIRED") {
        setIsModalOpen(false);
        const shouldRedirect = window.confirm(
          error.message || "Please log in to continue. Redirect to login?"
        );
        if (shouldRedirect) {
          navigate("/login", { state: { from: `/book/${book.key}` } });
        }
      } else {
        alert(
          error?.message || "Failed to update book status. Please try again."
        );
      }
    }
  };

  const handleAddJournal = (e: any) => {
    e.stopPropagation();
    if (!currentUser) {
      alert("Please log in to add journal entries");
      navigate("/login", {
        state: { from: `/book/${book.key}` },
      });
      return;
    }

    if (book) {
      navigate("/add-journal", { state: { bookKey: book.key } });
    }
  };

  return (
    <>
      <div
        className="card rounded-4 shadow-sm mb-4 hover-lift"
        onClick={onClick}
        style={{
          cursor: "pointer",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="card-body p-4">
          <div className="row g-4">
            {/* Book Cover */}
            <div className="col-auto">
              <div className="position-relative book-cover-wrapper">
                <img
                  src={coverUrl}
                  alt={`${book.title} cover`}
                  className="rounded-3 shadow-sm book-cover"
                  style={{
                    width: "88px",
                    height: "132px",
                    objectFit: "cover",
                    transition: "transform 0.25s ease",
                  }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-3 book-overlay"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.15), transparent)",
                    opacity: 0,
                    transition: "opacity 0.25s ease",
                  }}
                ></div>
              </div>
            </div>

            {/* Book Details */}
            <div className="col">
              <div className="mb-3">
                <div className="d-flex align-items-start justify-content-between">
                  <div className="flex-grow-1 me-3">
                    <h3
                      className="fw-bold text-dark fs-5 mb-1 book-title"
                      style={{ lineHeight: "1.3" }}
                    >
                      {book.title}
                    </h3>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <p className="text-secondary fw-medium mb-0">
                        {book.author_name?.[0] || "Unknown Author"}
                      </p>
                      <span className="text-muted">•</span>
                      <p className="text-muted small mb-0">
                        {book.first_publish_year || "Unknown Year"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <p
                  className="text-secondary mb-0 line-clamp-2"
                  style={{ lineHeight: "1.6" }}
                >
                  {description}
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="d-flex align-items-center gap-3 flex-wrap">
                {/* Status Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                  className={`btn btn-lg d-flex align-items-center gap-2 rounded-pill shadow-sm text-white ${getStatusColor(
                    status
                  )}`}
                  style={{
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    paddingInline: "1rem",
                  }}
                >
                  <span className="small fw-bold" style={{ lineHeight: "1.5" }}>
                    {status ? statusLabels[status] : "Add to Shelf"}
                  </span>
                  <ChevronDown size={16} color="currentColor" />
                </button>

                {/* Add Journal Entry Button */}
                <button
                  className="btn btn-lg btn-success d-flex align-items-center rounded-pill gap-2 shadow-sm"
                  onClick={(e) => {
                    handleAddJournal(e);
                  }}
                  style={{
                    border: "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    paddingInline: "1rem",
                  }}
                >
                  <Plus size={16} />
                  <span className="small fw-bold" style={{ lineHeight: "1.5" }}>
                    Add Journal Entry
                  </span>
                </button>
              </div>
            </div>
          </div>
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

      <style>{`
      .hover-lift:hover {
        transform: translateY(-3px);
      }

      .book-cover-wrapper:hover .book-cover {
        transform: scale(1.04);
      }

      .book-cover-wrapper:hover .book-overlay {
        opacity: 1 !important;
      }

      .book-title {
        transition: color 0.25s ease;
      }

      .card:hover .book-title {
        color: #374151 !important;
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .btn:hover {
        transform: translateY(-1px);
      }
    `}</style>
    </>
  );
};

export default BookCard;
