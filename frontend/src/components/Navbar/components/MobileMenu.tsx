import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  handleLogout: () => void;
  goToProfile: () => void;
  closeMenu: () => void;
}

const MobileMenu: React.FC<Props> = ({
  handleLogout,
  goToProfile,
  closeMenu,
}) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `dropdown-item menu-item rounded-2 d-block w-100 px-3 py-2 fw-medium ${
      isActive ? "menu-item-active" : ""
    }`;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Layout of the dropdown panel */
        .mobile-menu {
          min-width: 200px;
          right: 1rem;
          top: 100%;
          z-index: 1050;
          animation: slideIn 0.15s ease-out;
          padding: .5rem;           
        }

        /* Base item */
        .menu-item {
          transition: background-color 0.15s ease, transform 0.1s ease;
          text-decoration: none;
        }

        /* While pressing/tapping */
        .menu-item:active {
          transform: scale(0.98);
          /* optional: tweak the pressed background */
          background-color: rgba(255, 193, 7, 0.12); 
        }

        /* When route is active (NavLink) */
        .menu-item-active {
          background-color: rgba(255, 193, 7, 0.16);
          color: #A07900;           
          font-weight: 600;
        }

        /* Optional: unify icon + text color inside active state */
        .menu-item-active i { color: inherit; }
      `}</style>

      <div className="position-absolute end-0 mt-2 bg-white shadow-md border-0 rounded-3 mobile-menu">
        <>
          <NavLink to="/" className={linkClass} onClick={closeMenu}>
            <i className="bi bi-house-door me-2"></i> Home
          </NavLink>

          <NavLink to="/my-books" className={linkClass} onClick={closeMenu}>
            <i className="bi bi-bookshelf me-2"></i> Shelves
          </NavLink>

          <NavLink to="/journals" className={linkClass} onClick={closeMenu}>
            <i className="bi bi-journal-text me-2"></i> Journals
          </NavLink>

          <button
            className="dropdown-item menu-item rounded-2 d-block w-100 px-3 py-2 fw-medium text-start bg-transparent border-0"
            onClick={() => {
              closeMenu();
              goToProfile();
            }}
          >
            <i className="bi bi-person-circle me-2"></i> Profile
          </button>

          <button
            className="dropdown-item menu-item text-danger rounded-2 d-block w-100 px-3 py-2 fw-medium text-start bg-transparent border-0"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </>
      </div>
    </>
  );
};

export default MobileMenu;
