import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export const useBookData = (bookKey: string) => {
  const [title, setTitle] = useState<string>("");
  const [covers, setCovers] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookKey) {
        setError("No book key provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const bookResponse = await axios.get(`/openlibrary.org${bookKey}.json`);
        const bookData = bookResponse.data;

        setTitle(bookData.title);
        setCovers(bookData.covers);

        if (bookData.authors?.length) {
          try {
            const authorNames = await Promise.all(
              bookData.authors.map(
                async (authorData: { author: { key: string } }) => {
                  const key = authorData?.author?.key;
                  if (!key) return null;

                  const { data } = await axios.get(
                    `/openlibrary.org${key}.json`
                  );
                  return data?.name || null;
                }
              )
            );

            setAuthors(authorNames.filter(Boolean));

            const desc =
              typeof bookData.description === "object"
                ? bookData.description.value
                : bookData.description || "No description available";
            setDescription(desc);

            const subjects: string[] = bookData.subjects || [];
            setGenres(subjects.slice(0, 5));
          } catch (error: unknown) {
            const err = error as Error;
            console.log(err.message);
            setAuthors(["Unknown Author"]);
          }
        } else {
          setAuthors(["Unknown Author"]);
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.log(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookKey]);

  const coverUrl = useMemo(() => {
    const id = covers?.[0];
    return id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : null;
  }, [covers]);

  return {
    title,
    authors,
    coverUrl,
    description,
    genres,
    loading,
    setLoading,
    error,
    setError,
  };
};
