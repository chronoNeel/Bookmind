import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { Book } from "@models/Book";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@api/axiosInstance";

const TrendingBooks: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("trendingBooks");

    if (cached) {
      setBooks(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchTrendingBooks = async () => {
      try {
        const res = await axiosInstance.get("/trending/weekly.json");
        const data =
          res.data?.works?.filter((b: Book) => b.cover_i).slice(0, 6) || [];
        setBooks(data);
        localStorage.setItem("trendingBooks", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to load trending books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  const handleClick = (key: string) =>
    navigate(`/book/${encodeURIComponent(key)}`);

  return (
    <div className="w-100">
      <h2 className="fs-3 fw-bold mb-4 text-center text-dark">
        Trending This Week
      </h2>

      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-3 g-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="col">
                <BookCard book={{ key: "", title: "", cover_i: 0 }} isLoading />
              </div>
            ))
          : books.map((book, i) => (
              <div key={book.key || i} className="col">
                <BookCard book={book} onClick={() => handleClick(book.key)} />
              </div>
            ))}
      </div>
    </div>
  );
};

export default TrendingBooks;
