import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";

interface Following {
  id: number;
  name: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
}

const Followings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [followings, setFollowings] = useState<Following[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  // Generate mock followings data with random images
  useEffect(() => {
    const generateFollowings = () => {
      const mockFollowings: Following[] = Array.from(
        { length: 32 },
        (_, index) => ({
          id: index + 1,
          name: `Following ${index + 1}`,
          username: `following${index + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
          isFollowing: Math.random() > 0.5,
        })
      );
      return mockFollowings;
    };

    const allFollowings = generateFollowings();
    setFollowings(allFollowings);
    setTotalPages(Math.ceil(allFollowings.length / itemsPerPage));
  }, []);

  // Get current page followings
  const getCurrentFollowings = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return followings.slice(startIndex, endIndex);
  };

  const handleFollowToggle = (followingId: number) => {
    setFollowings((prev) =>
      prev.map((following) =>
        following.id === followingId
          ? { ...following, isFollowing: !following.isFollowing }
          : following
      )
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-vh-100 position-relative overflow-hidden text-dark p-3 p-md-4"
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

      {/* Main content */}
      <div className="position-relative z-1">
        {/* Header */}
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              {/* Back button and title */}
              <div className="d-flex align-items-center mb-4">
                <button
                  onClick={handleBack}
                  className="btn btn-outline-amber me-3 d-flex align-items-center"
                  style={{
                    borderColor: "#d97706",
                    color: "#d97706",
                  }}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="d-flex align-items-center">
                  <Users size={28} className="text-amber-600 me-2" />
                  <h1 className="h3 mb-0 text-gray-800 fw-bold">
                    {user || "User"}'s Followings
                  </h1>
                  <span className="badge bg-[#4F200D] ms-3 px-3 py-2">
                    {followings.length} followings
                  </span>
                </div>
              </div>

              {/* Followings grid */}
              <div className="row g-3">
                {getCurrentFollowings().map((following) => (
                  <div
                    key={following.id}
                    className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  >
                    <div
                      className="card h-100 border-0 shadow-sm hover-shadow transition-all"
                      style={{
                        background: "rgba(255, 251, 235, 0.8)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div className="card-body text-center p-4">
                        {/* Avatar */}
                        <div className="mb-3">
                          <img
                            src={following.avatar}
                            alt={following.name}
                            className="rounded-circle border-3 border-amber-200"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        {/* User info */}
                        <h5 className="card-title text-gray-800 mb-1 fw-semibold">
                          {following.name}
                        </h5>
                        <p className="text-muted small mb-3">
                          @{following.username}
                        </p>

                        {/* Follow button */}
                        <button
                          onClick={() => handleFollowToggle(following.id)}
                          className={`btn btn-sm w-100 ${
                            following.isFollowing
                              ? "btn-outline-amber"
                              : "btn-amber text-white"
                          }`}
                          style={{
                            borderColor: "#d97706",
                            backgroundColor: following.isFollowing
                              ? "transparent"
                              : "#d97706",
                            color: following.isFollowing ? "#d97706" : "white",
                          }}
                        >
                          {following.isFollowing ? "Following" : "Follow"}
                        </button>
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
                      {/* Previous button */}
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link text-amber-600 border-amber-200"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={{
                            backgroundColor: "transparent",
                            borderColor: "#fbbf24",
                          }}
                        >
                          Previous
                        </button>
                      </li>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <li
                            key={page}
                            className={`page-item ${
                              currentPage === page ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link border-amber-200"
                              onClick={() => handlePageChange(page)}
                              style={{
                                backgroundColor:
                                  currentPage === page
                                    ? "#d97706"
                                    : "transparent",
                                borderColor: "#fbbf24",
                                color:
                                  currentPage === page ? "white" : "#d97706",
                              }}
                            >
                              {page}
                            </button>
                          </li>
                        )
                      )}

                      {/* Next button */}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link text-amber-600 border-amber-200"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          style={{
                            backgroundColor: "transparent",
                            borderColor: "#fbbf24",
                          }}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}

              {/* Empty state */}
              {followings.length === 0 && (
                <div className="text-center py-5">
                  <Users size={64} className="text-amber-200 mb-3" />
                  <h3 className="text-gray-600 mb-2">No followings yet</h3>
                  <p className="text-muted">
                    When someone follows this user, they'll appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(217, 119, 6, 0.15) !important;
          transform: translateY(-2px);
        }
        .border-amber-200 {
          border-color: #fde68a !important;
        }
        .text-amber-600 {
          color: #d97706 !important;
        }
        .bg-amber-100 {
          background-color: #fef3c7 !important;
        }
        .btn-amber {
          background-color: #d97706;
          border-color: #d97706;
        }
        .btn-outline-amber {
          color: #d97706;
          border-color: #d97706;
        }
        .btn-outline-amber:hover {
          background-color: #d97706;
          color: white;
        }
        .page-link:hover {
          background-color: #fef3c7 !important;
          color: #d97706 !important;
        }
      `}</style>
    </div>
  );
};

export default Followings;
