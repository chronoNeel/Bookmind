import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "@store/slices/authSlice";
import DesktopNav from "./components/DesktopNav";
import UserMenu from "./components/UserMenu";
import MobileMenu from "./components/MobileMenu";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import assets from "@assets/assets";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (dropdownOpen && !target.closest(".dropdown")) setDropdownOpen(false);
      if (mobileMenuOpen && !target.closest(".mobile-menu-container"))
        setMobileMenuOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dropdownOpen, mobileMenuOpen]);

  useEffect(() => setDropdownOpen(false), [location.pathname]);

  return (
    <nav
      className="navbar navbar-expand-md bg-white border-bottom shadow-sm py-2 px-3 px-md-4"
      style={{ "--bs-warning-rgb": "158,129,112" } as React.CSSProperties}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div style={{ width: "180px" }}>
          <img
            src={assets.bookmind_nav}
            alt="BookMind"
            className="img-fluid"
            style={{ cursor: "pointer", width: "200px", objectFit: "contain" }}
            onClick={() => navigate("/")}
          />
        </div>

        {isAuthenticated && (
          <div className="d-none d-md-flex flex-grow-1 justify-content-center">
            <DesktopNav />
          </div>
        )}

        <div className="d-flex justify-content-end" style={{ width: "180px" }}>
          {isAuthenticated && user ? (
            <>
              <div className="d-none d-md-flex">
                <UserMenu
                  user={user}
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  handleLogout={handleLogout}
                />
              </div>

              <div className="d-md-none mobile-menu-container position-relative">
                <button
                  className="btn p-0"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <i className="bi bi-list fs-2 text-dark"></i>
                </button>

                {mobileMenuOpen && (
                  <MobileMenu
                    handleLogout={handleLogout}
                    userName={user.userName || ""}
                    closeMenu={() => setMobileMenuOpen(false)}
                  />
                )}
              </div>
            </>
          ) : (
            <button
              className="btn btn-secondary rounded-pill px-4 py-2 fw-semibold text-white"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
