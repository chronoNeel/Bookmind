import React from "react";
import { UserData } from "../../../models/user";
import { NavLink } from "react-router-dom";

interface Props {
  user: UserData;
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}

const UserMenu: React.FC<Props> = ({
  user,
  dropdownOpen,
  setDropdownOpen,
  handleLogout,
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

        .menu-dropdown {
          min-width: 200px;
          animation: slideIn 0.15s ease-out;
          padding: 0.5rem;
        }

        .menu-item {
          transition: background-color 0.15s ease, transform 0.1s ease;
          text-decoration: none;
        }

        .menu-item:active {
          transform: scale(0.98);
          background-color: rgba(255, 193, 7, 0.12); 
        }

        .menu-item-active {
          background-color: rgba(255, 193, 7, 0.16);
          color: #A07900;
          font-weight: 600;
        }

        .menu-item-active i { color: inherit; }
      `}</style>

      <div className="dropdown position-relative">
        <button
          className="btn btn-link p-0 border-0 text-decoration-none d-flex align-items-center"
          style={{ outline: "none", boxShadow: "none" }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          type="button"
        >
          <div className="position-relative">
            <img
              src={user.profilePic}
              alt="Profile"
              className="rounded-circle border-2 border-light shadow-sm"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          <i
            className="bi bi-caret-down-fill ms-2 text-secondary"
            style={{
              transition: "transform 0.2s ease",
              transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          ></i>
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-md border-0 rounded-3 overflow-hidden menu-dropdown bg-white">
            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setDropdownOpen(false)}
            >
              <i className="bi bi-house-door me-2"></i>
              Home
            </NavLink>

            <NavLink
              to="/my-books"
              className={linkClass}
              onClick={() => setDropdownOpen(false)}
            >
              <i className="bi bi-bookshelf me-2"></i>
              Shelves
            </NavLink>

            <NavLink
              to="/journals"
              className={linkClass}
              onClick={() => setDropdownOpen(false)}
            >
              <i className="bi bi-journal-text me-2"></i>
              Journals
            </NavLink>

            <NavLink
              to={`/profile/${user.userName}`}
              className={linkClass}
              onClick={() => setDropdownOpen(false)}
            >
              <i className="bi bi-person-circle me-2"></i>
              Profile
            </NavLink>

            <hr className="dropdown-divider my-1" />

            <button
              className="dropdown-item menu-item text-danger rounded-2 d-block w-100 px-3 py-2 fw-medium text-start bg-transparent border-0"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserMenu;
