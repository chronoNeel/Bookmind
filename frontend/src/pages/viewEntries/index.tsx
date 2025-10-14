import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Heart,
  Smile,
  Zap,
  Coffee,
  Cloud,
  Meh,
  Frown,
  Angry,
  BookOpen,
  Calendar,
  Star,
  Lock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import bonjourTristesseEntries from "../../assets/entriesData";

const ViewEntries = () => {
  const location = useLocation();
  const book = location.state?.book;
  const bookJournals = Object.values(bonjourTristesseEntries).flat();

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;

  // Mood configuration
  const moodConfig = {
    Loved: { icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    Happy: { icon: Smile, color: "text-green-500", bg: "bg-green-50" },
    Excited: { icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
    Cozy: { icon: Coffee, color: "text-amber-600", bg: "bg-amber-50" },
    Melancholy: { icon: Cloud, color: "text-blue-400", bg: "bg-blue-50" },
    Neutral: { icon: Meh, color: "text-gray-500", bg: "bg-gray-50" },
    Sad: { icon: Frown, color: "text-blue-600", bg: "bg-blue-50" },
    Frustrated: { icon: Angry, color: "text-red-600", bg: "bg-red-50" },
  };

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = bookJournals.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(bookJournals.length / entriesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
        }
      />
    ));
  };

  const MoodIcon = ({ mood }: { mood: string }) => {
    const config = moodConfig[mood as keyof typeof moodConfig];
    if (!config) return null;
    const IconComponent = config.icon;
    return <IconComponent size={18} className={config.color} />;
  };

  return (
    <div
      className="min-vh-100 position-relative overflow-hidden p-3 p-md-4"
      style={{
        background: "linear-gradient(135deg, #fffaea 50%, #fef3e2 100%)",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          pointerEvents: "none",
          opacity: 0.3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <div className="position-relative z-1 container max-w-3xl mx-auto">
        {/* Book Header */}
        {book && (
          <div className="text-center mb-5">
            <div className="d-flex align-items-center justify-content-center gap-4 mb-4">
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="rounded shadow-lg border-3 border-amber-200"
                style={{ width: "100px", height: "150px", objectFit: "cover" }}
              />
              <div className="text-start">
                <h1 className="fw-bold mb-2" style={{ color: "#5a4a3a" }}>
                  {book.title}
                </h1>
                <p className="text-muted mb-3 fs-5">
                  {book.author_name?.[0] || "Unknown Author"}
                </p>
                <div className="d-flex align-items-center gap-3 text-muted">
                  <div className="d-flex align-items-center gap-1">
                    <Calendar size={16} />
                    <span>First published {book.first_publish_year}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <BookOpen size={16} />
                    <span>{bookJournals.length} journal entries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Journal Entries */}
        <div className="row g-4">
          {currentEntries.map((entry, index) => (
            <div key={entry.id} className="col-12">
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  background: "linear-gradient(135deg, #fff9f0 0%, #fff 100%)",
                  borderRadius: "15px",
                }}
              >
                <div className="card-body p-4">
                  {/* Entry Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${
                          moodConfig[entry.mood as keyof typeof moodConfig]
                            ?.bg || "bg-gray-50"
                        }`}
                      >
                        <MoodIcon mood={entry.mood} />
                        <span
                          className="fw-semibold"
                          style={{ color: "#5a4a3a", fontSize: "0.9rem" }}
                        >
                          {entry.mood}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        {renderStars(entry.rating)}
                        <span className="text-muted small">
                          ({entry.rating}/5)
                        </span>
                      </div>
                      {entry.isPrivate && (
                        <Lock size={16} className="text-muted" />
                      )}
                    </div>
                    <span className="text-muted small">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>

                  {/* Main Entry */}
                  <div className="mb-3">
                    <p className="text-dark" style={{ lineHeight: "1.6" }}>
                      {entry.entry.length > 200
                        ? `${entry.entry.substring(0, 200)}...`
                        : entry.entry}
                    </p>
                  </div>

                  {/* Prompt Responses */}
                  <div className="mb-4">
                    <div className="row g-2">
                      {Object.entries(entry.promptResponses).map(
                        ([key, value]) => (
                          <div key={key} className="col-12 col-md-6">
                            <div
                              className="p-3 rounded"
                              style={{ background: "rgba(253, 230, 138, 0.2)" }}
                            >
                              <strong
                                className="text-capitalize d-block mb-1"
                                style={{
                                  color: "#92400e",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </strong>
                              <p className="mb-0 small text-dark">{value}</p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <div className="d-flex align-items-center gap-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="d-flex align-items-center gap-1">
                          <ArrowUp size={16} className="text-success" />
                          <span className="small">{entry.upvotes}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <ArrowDown size={16} className="text-danger" />
                          <span className="small">{entry.downvotes}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-1 text-muted small">
                        <BookOpen size={14} />
                        <span>{entry.readingProgress}% completed</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm px-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #fef3e2 0%, #fde68a 100%)",
                        border: "1px solid #fcd34d",
                        color: "#92400e",
                        fontWeight: "500",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                      }}
                    >
                      Read more →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <nav>
              <ul className="pagination">
                <li className="page-item">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="page-link border-0 mx-1 rounded-pill"
                    style={{
                      background:
                        "linear-gradient(135deg, #fef3e2 0%, #fde68a 100%)",
                      color: "#92400e",
                      minWidth: "40px",
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  >
                    ‹
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li key={page} className="page-item">
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`page-link border-0 mx-1 rounded-pill ${
                          page === currentPage ? "active" : ""
                        }`}
                        style={{
                          background:
                            page === currentPage
                              ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                              : "linear-gradient(135deg, #fef3e2 0%, #fde68a 100%)",
                          color: page === currentPage ? "white" : "#92400e",
                          minWidth: "40px",
                          border:
                            page === currentPage
                              ? "1px solid #f59e0b"
                              : "1px solid #fcd34d",
                        }}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}
                <li className="page-item">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="page-link border-0 mx-1 rounded-pill"
                    style={{
                      background:
                        "linear-gradient(135deg, #fef3e2 0%, #fde68a 100%)",
                      color: "#92400e",
                      minWidth: "40px",
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                  >
                    ›
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEntries;
