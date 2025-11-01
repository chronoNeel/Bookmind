import React from "react";
import { NavLink } from "react-router-dom";

const DesktopNav: React.FC = () => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `nav-link fw-medium ${
      isActive ? "text-warning fw-semibold" : "text-secondary"
    }`;

  return (
    <ul className="navbar-nav gap-3 flex-row">
      <li className="nav-item">
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/my-books" className={linkClasses}>
          Shelves
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/journals" className={linkClasses}>
          Journals
        </NavLink>
      </li>
    </ul>
  );
};

export default DesktopNav;
