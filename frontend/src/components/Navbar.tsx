import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/asstes";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { logoutUser } from "../store/slices/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [token, setToken] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    setToken(false);
    setMobileMenuOpen(false);
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (dropdownOpen && !target.closest(".dropdown")) {
        setDropdownOpen(false);
      }

      if (mobileMenuOpen && !target.closest(".mobile-menu-container")) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen, mobileMenuOpen]);
  return (
    <>
      <style>
        {`
          .hover-custom:hover {
            color: #4F200D !important;
          }
          
          .text-custom-primary {
            color: #4F200D !important;
          }
          
          .text-custom-secondary {
            color: #FF9F1C !important;
          }
          
          .btn-custom {
            background-color: #FF9F1C;
            border-color: #FF9F1C;
            color: #4F200D;
          }
          
          .btn-custom:hover {
            background-color: #4F200D;
            border-color: #4F200D;
            color: #FF9F1C;
          }
          
          .dropdown-item-custom {
            transition: all 0.2s ease;
          }
          
          .dropdown-item-custom:hover {
            color: #4F200D !important;
          }
          
          .dropdown-item-custom.active {
            color: #FF9F1C !important;
          }
        `}
      </style>

      <nav className="navbar bg-white border-bottom shadow-sm py-2 px-3 px-md-4">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center w-100 position-relative">
            {/* Logo - Fixed width */}
            <div className="flex-shrink-0" style={{ width: "180px" }}>
              <img
                src={assets.bookmind_nav}
                alt="Navbar BookMind Logo"
                className="me-2"
                style={{
                  height: "auto",
                  width: "200px",
                  maxWidth: "200px",
                  cursor: "pointer",
                  objectFit: "contain",
                }}
                onClick={() => navigate("/")}
              />
            </div>

            {/* Desktop Navigation Links - Perfectly Centered */}
            <div className="position-absolute start-50 translate-middle-x">
              <ul className="navbar-nav gap-3 fw-medium text-secondary d-none d-md-flex flex-row">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-custom-secondary fw-semibold"
                        : "nav-link text-secondary hover-custom"
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/my-books"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-custom-secondary fw-semibold"
                        : "nav-link text-secondary hover-custom"
                    }
                  >
                    My Books
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/journals"
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link text-custom-secondary fw-semibold"
                        : "nav-link text-secondary hover-custom"
                    }
                  >
                    Journals
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Desktop Profile/Login - Fixed width */}
            <div
              className="d-none d-md-flex align-items-center flex-shrink-0 justify-content-end"
              style={{ width: "180px" }}
            >
              {token ? (
                <div className="dropdown position-relative">
                  <div
                    className="d-flex align-items-center"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={assets.profile_pic}
                      alt="Profile"
                      className="rounded-circle border border-secondary"
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "cover",
                      }}
                    />
                    <i
                      className="bi bi-caret-down-fill ms-2"
                      style={{
                        fontSize: "0.9rem",
                        position: "relative",
                        bottom: "-2px",
                      }}
                    ></i>
                  </div>

                  {dropdownOpen && (
                    <div
                      className="dropdown-menu show position-absolute end-0 mt-2 shadow border rounded-3"
                      style={{ minWidth: "180px", zIndex: 1050 }}
                    >
                      <button
                        className="dropdown-item dropdown-item-custom"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/profile/noobmaster_69");
                        }}
                      >
                        Profile
                      </button>
                      <hr className="dropdown-divider my-1 opacity-25" />
                      <button
                        className="dropdown-item dropdown-item-custom"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/my-books");
                        }}
                      >
                        My Books
                      </button>
                      <hr className="dropdown-divider my-1 opacity-25" />
                      <button
                        className="dropdown-item dropdown-item-custom "
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/journals");
                        }}
                      >
                        Journals
                      </button>
                      <hr className="dropdown-divider my-1 opacity-25" />
                      <button
                        className="dropdown-item dropdown-item-custom text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="btn btn-custom rounded-pill px-4 py-2 fw-semibold"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="d-md-none mobile-menu-container flex-shrink-0">
              <button
                className="btn p-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                <i
                  className="bi bi-list"
                  style={{
                    fontSize: "2rem",
                    color: "#4F200D",
                  }}
                ></i>
              </button>

              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <div
                  className="position-absolute end-0 mt-2 pl-3 bg-white shadow-lg border rounded-3"
                  style={{
                    minWidth: "180px",
                    zIndex: 1050,
                    right: "1rem",
                    top: "100%",
                  }}
                >
                  <div className="py-2">
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "dropdown-item dropdown-item-custom active fw-semibold py-2"
                          : "dropdown-item dropdown-item-custom py-2"
                      }
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-house-door me-2"></i>
                      Home
                    </NavLink>
                    <hr className="dropdown-divider my-1" />
                    <NavLink
                      to="/my-books"
                      className={({ isActive }) =>
                        isActive
                          ? "dropdown-item dropdown-item-custom active fw-semibold py-2"
                          : "dropdown-item dropdown-item-custom py-2"
                      }
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-book me-2"></i>
                      My Books
                    </NavLink>
                    <hr className="dropdown-divider my-1" />
                    <NavLink
                      to="/journals"
                      className={({ isActive }) =>
                        isActive
                          ? "dropdown-item dropdown-item-custom active fw-semibold py-2"
                          : "dropdown-item dropdown-item-custom py-2"
                      }
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-journal-text me-2"></i>
                      Journals
                    </NavLink>

                    {token ? (
                      <>
                        <hr
                          className="dropdown-divider my-2"
                          style={{ borderWidth: "2px" }}
                        />
                        <button
                          className="dropdown-item dropdown-item-custom py-2"
                          onClick={() => {
                            handleNavClick();
                            navigate("/profile/noobmaster_69");
                          }}
                        >
                          <i className="bi bi-person-circle me-2"></i>
                          Profile
                        </button>
                        <hr className="dropdown-divider my-1" />
                        <button
                          className="dropdown-item dropdown-item-custom text-danger py-2"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <hr
                          className="dropdown-divider my-2"
                          style={{ borderWidth: "2px" }}
                        />
                        <button
                          className="dropdown-item dropdown-item-custom fw-semibold py-2"
                          onClick={() => {
                            handleNavClick();
                            navigate("/login");
                          }}
                        >
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Login
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
