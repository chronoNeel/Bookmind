import React, { useEffect, useState } from "react";

interface BookCardProps {
  bookKey: string;
}

export const BookCard: React.FC<BookCardProps> = ({ bookKey }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`https://openlibrary.org${bookKey}.json`);

        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }

        const data = await response.json();

        // Set title
        setTitle(data.title || "Unknown Title");

        // Set cover if available
        if (data.covers && data.covers.length > 0) {
          setCoverUrl(
            `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`
          );
        }

        // Fetch author names if available
        if (data.authors && data.authors.length > 0) {
          try {
            const authorResponse = await fetch(
              `https://openlibrary.org${data.authors[0].author.key}.json`
            );
            if (authorResponse.ok) {
              const authorData = await authorResponse.json();
              setAuthor(authorData.name || "Unknown Author");
            } else {
              setAuthor("Unknown Author");
            }
          } catch {
            setAuthor("Unknown Author");
          }
        } else {
          setAuthor("Unknown Author");
        }
      } catch (error) {
        console.error("Failed to fetch book details:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookKey]);

  if (loading) {
    return (
      <div className="w-32 h-48 flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (error || !title) {
    return (
      <div className="w-32 h-48 flex items-center justify-center text-red-400 text-sm">
        Failed to load
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-32 group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No Cover
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-2 text-white text-xs">
            <p className="font-semibold truncate">{title}</p>
            <p className="text-gray-300 truncate">{author}</p>
          </div>
        </div>
      </div>
      <div className="mt-2 px-1">
        <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-500 truncate">{author}</p>
      </div>
    </div>
  );
};
