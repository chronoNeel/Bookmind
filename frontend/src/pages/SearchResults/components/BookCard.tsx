import React, { useEffect, useMemo, useState } from "react";
import { Book } from "@models/Book";
import { ChevronDown, Plus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getBookShelf, ShelfType } from "@utils/getBookData";
import StatusModal from "@/components/StatusModal";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { toast } from "react-toastify";
import { setBookStatus } from "@store/slices/shelfSlice";
import { getStatusColor } from "@utils/statusHelpers";
import { StatusValue } from "@models/StatusModal";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [status, setStatus] = useState<ShelfType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [authors, setAuthors] = useState<string>("Unknown Author");

  const coverUrl = useMemo(() => {
    if (!book?.cover_i) return undefined;
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  }, [book?.cover_i]);

  useEffect(() => {
    if (!book || !currentUser?.shelves) return;

    const shelf = getBookShelf({
      shelves: currentUser.shelves,
      bookKey: book.key,
    });

    setStatus(shelf);
  }, [currentUser?.shelves, book]);

  const statusLabels = {
    wantToRead: "Want to Read",
    ongoing: "Ongoing",
    completed: "Completed",
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
            const authorNames = await Promise.all(
              bookData.authors.map(
                async (authorData: { author: { key: string } }) => {
                  const key = authorData?.author?.key;
                  if (!key) return null;

                  const { data } = await axios.get(
                    `/openlibrary.org${key}.json`
                  );
                  return data?.name || null;
                }
              )
            );

            setAuthors(authorNames.filter(Boolean).join(", "));
          } catch (authorError: unknown) {
            console.error("Error fetching author:", authorError);
            setAuthors("Unknown Author");
          }
        } else {
          setAuthors("Unknown Author");
        }
      } catch {
        setDescription("No description available");
      }
    };

    getDescription();
  }, [book.key]);

  const handleStatusChange = async (newStatus: StatusValue) => {
    if (!book?.key) return;

    if (!currentUser) {
      setIsModalOpen(false);
      toast.warn("Please log in to add books to your shelves.", {
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/login", { state: { from: `/search-results` } });
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

      toast.success(toasterText, {
        position: "top-right",
      });
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
            navigate("/login", { state: { from: `/search-results` } });
          }
        }
      } else {
        alert("Failed to update book status. Please try again.");
      }
    }
  };

  const handleAddJournal = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();

    if (!currentUser) {
      alert("Please log in to add journal entries");
      navigate("/login", { state: { from: `/book/${book.key}` } });
      return;
    }

    navigate("/add-journal", { state: { bookKey: book.key } });
  };

  return (
    <>
      <div
        className="card mb-4 shadow-sm hover-lift border-0 bg-white"
        onClick={onClick}
        style={{ cursor: "pointer", transition: "all 0.25s ease" }}
      >
        <div className="card-body p-4">
          <div className="row g-4">
            {/* Book Cover */}
            <div className="col-auto">
              <div className="position-relative overflow-hidden rounded-3">
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
              </div>
            </div>

            {/* Book Details */}
            <div className="col">
              <h5 className="fw-bold text-dark mb-1">{book.title}</h5>
              <div className="d-flex align-items-center text-muted small mb-2">
                <span>{book.author_name?.[0] || "Unknown Author"}</span>
                <span className="mx-2">•</span>
                <span>{book.first_publish_year || "Unknown Year"}</span>
              </div>

              <p className="text-secondary small mb-3 text-truncate-2">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                  style={{ width: "180px", fontSize: "0.85rem" }}
                  className={`btn btn-sm fw-bold text-white rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2 py-2 px-3 ${getStatusColor(
                    status
                  )}`}
                >
                  {status ? statusLabels[status] : "Add to Shelf"}
                  <ChevronDown size={16} />
                </button>

                <button
                  onClick={handleAddJournal}
                  style={{ width: "180px", fontSize: "0.85rem" }}
                  className="btn btn-sm fw-bold text-white rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2 py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  <Plus size={16} />
                  <span className="text-center">Add Journal Entry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <StatusModal
          book={book}
          authors={authors}
          currentStatus={status}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusChange}
        />
      )}

      <style>{`
      .hover-lift:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.1);
      }
      .book-cover:hover {
        transform: scale(1.05);
      }
      .text-truncate-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `}</style>
    </>
  );
};

export default BookCard;
