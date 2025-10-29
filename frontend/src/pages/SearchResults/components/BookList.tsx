import React from "react";
import BookCard from "./BookCard";
import { Book } from "@models/Book";
import { useNavigate } from "react-router-dom";

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  const navigate = useNavigate();

  if (books.length === 0) {
    return <p className="text-center text-gray-500">No books found.</p>;
  }

  return (
    <div className="space-y-6">
      {books.map((book) => (
        <BookCard
          key={book.key}
          book={book}
          onClick={() => navigate(`/book/${encodeURIComponent(book.key)}`)}
        />
      ))}
    </div>
  );
};

export default BookList;
