import React, { useEffect, useState } from "react";
import { Book } from "../../../types/Book";
import { ChevronDown, Plus, BookOpen, Edit3, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookToShelf,
  removeBookFromShelf,
} from "../../../store/slices/shelfSlice";
import { RootState } from "../../../store";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const shelves = useSelector((state: RootState) => state.shelf);

  const [status, setStatus] = useState<
    "wantToRead" | "ongoing" | "completed" | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");

  const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;

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
    if (shelves.completed.includes(book.key)) {
      setStatus("completed");
    } else if (shelves.ongoing.includes(book.key)) {
      setStatus("ongoing");
    } else if (shelves.wantToRead.includes(book.key)) {
      setStatus("wantToRead");
    } else {
      setStatus(null);
    }
  }, [shelves, book.key]);

  useEffect(() => {
    const getDescription = async () => {
      try {
        const res = await axios.get(`/api/openlibrary${book.key}.json`);

        const descData =
          res.data?.description?.value || res.data?.description || "";

        setDescription(descData);
      } catch (err) {
        console.error("Failed to fetch description:", err);
        setDescription("No description available");
      }
    };

    getDescription();
  }, [book.key]);

  const handleStatusChange = (
    newStatus: "wantToRead" | "ongoing" | "completed" | "remove"
  ) => {
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

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 mb-4 group hover:bg-gradient-to-r hover:from-gray-50 hover:to-white"
        onClick={onClick}
      >
        <div className="flex gap-6">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={coverUrl}
                alt={`${book.title} cover`}
                className="w-20 h-32 object-cover rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Title and Author Section */}
            <div className="mb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-bold text-gray-900 text-xl leading-tight mb-1 group-hover:text-gray-800 transition-colors">
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-600 font-medium">
                      {book.author_name?.[0] || "Unknown Author"}
                    </p>
                    <span className="text-gray-400">•</span>
                    <p className="text-gray-500 text-sm">
                      {book.first_publish_year || "Unknown Year"}
                    </p>
                  </div>
                </div>

                {/* Entries Badge */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span className="font-semibold text-sm">3</span>
                    <span className="text-sm">entries</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-gray-600 leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-4">
              {/* Status Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${getStatusColor(
                  status
                )}`}
              >
                <span>{status ? statusLabels[status] : "Add to Shelf"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Add Journal Entry Button */}
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/add-journal", { state: { bookKey: book.key } });
                }}
              >
                <Plus className="w-4 h-4" />
                <span>Add Journal Entry</span>
              </button>

              {/* View Entries Button */}
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/view-entries", { state: { bookKey: book.key } });
                }}
              >
                <BookOpen className="w-4 h-4" />
                <span>View Entries</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Selection Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
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
              <p className="text-sm text-gray-600">
                {book.author_name?.[0] || "Unknown Author"}
              </p>
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

export default BookCard;
