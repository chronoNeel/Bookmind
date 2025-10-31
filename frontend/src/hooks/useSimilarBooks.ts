import { useEffect, useState } from "react";
import { SimilarBook } from "../models/Book";
import axios from "axios";

export const useSimilarBooks = (bookKey: string, subjects: string[]) => {
  const [similarBooks, setSimilarBooks] = useState<SimilarBook[]>([]);

  useEffect(() => {
    const fetchSimilarBooks = async () => {
      const uniqueBooks = new Map<string, SimilarBook>();
      const maxSubjects = 3;
      const limitPerSubject = 5;

      try {
        for (const subject of subjects.slice(0, maxSubjects)) {
          const searchUrl = `https://openlibrary.org/search.json?q=subject:${encodeURIComponent(
            subject
          )}&limit=${limitPerSubject + 2}&fields=title,author_name,key,cover_i`;

          const searchResponse = await axios.get(searchUrl);

          (searchResponse.data.docs as Array<Record<string, unknown>>)
            .filter((doc) => typeof doc.key === "string" && doc.key !== bookKey)
            .forEach((doc) => {
              const key = doc.key as string;
              if (!uniqueBooks.has(key)) {
                uniqueBooks.set(key, {
                  title: doc.title as string,
                  author: Array.isArray(doc.author_name)
                    ? (doc.author_name[0] as string)
                    : "Unknown",
                  workKey: key,
                  coverUrl:
                    typeof doc.cover_i === "number"
                      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                      : null,
                  subject,
                });
              }
            });
        }

        setSimilarBooks(Array.from(uniqueBooks.values()).slice(0, 20));
      } catch (error: unknown) {
        const err = error as Error;
        console.log("Error fetching data ", err.message);
      }
    };

    fetchSimilarBooks();
  }, [subjects, bookKey]);

  return { similarBooks };
};
