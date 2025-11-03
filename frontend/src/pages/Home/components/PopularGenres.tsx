import React from "react";
import { useNavigate, Link } from "react-router-dom";

interface PopularGenresProps {
  genres: string[];
}

const PopularGenres: React.FC<PopularGenresProps> = ({ genres }) => {
  const navigate = useNavigate();

  const chipStyle: React.CSSProperties = {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    border: "none",
  };

  return (
    <div className="card border-0 rounded-3 shadow-sm">
      <div className="card-body p-4">
        <h3 className="card-title h5 fw-bold mb-3">Popular Genres</h3>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {genres.map((genre, i) => (
            <button
              key={i}
              className="btn btn-sm rounded-pill"
              style={chipStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#bfdbfe")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#dbeafe")
              }
              onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
            >
              {genre}
            </button>
          ))}

          <Link
            to="/genres"
            className="ms-1 text-sm text-primary p-0 no-underline hover:underline underline-offset-2 focus:underline"
          >
            All Genres
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularGenres;
