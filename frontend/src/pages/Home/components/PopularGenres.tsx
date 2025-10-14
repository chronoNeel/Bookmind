import React from "react";
import { useNavigate } from "react-router-dom";

interface PopularGenresProps {
  genres: string[];
}

const PopularGenres: React.FC<PopularGenresProps> = ({ genres }) => {
  const navigate = useNavigate();

  return (
    <div className="card border-0 rounded-3 shadow-sm">
      <div className="card-body p-4">
        <h3 className="card-title h5 fw-bold mb-3">Popular Genres</h3>
        <div className="d-flex flex-wrap gap-2">
          {genres.map((genre, index) => (
            <button
              key={index}
              className="btn btn-sm rounded-pill"
              style={{
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#bfdbfe";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dbeafe";
              }}
              onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularGenres;
