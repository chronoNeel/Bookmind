import axiosInstance from "./axiosInstance";
import { Book } from "@models/Book";
import { GenreBook } from "@models/GenreBook";

export const fetchBooks = async (searchTerm: string): Promise<Book[]> => {
  const response = await axiosInstance.get("/search.json", {
    params: {
      q: searchTerm,
      limit: 50,
    },
  });

  return response.data.docs.filter((book: Book) => Boolean(book.cover_i));
};

export const fetchTrendingBooks = async (): Promise<Book[]> => {
  const response = await axiosInstance.get("/trending/weekly.json");

  const booksWithCovers =
    response.data.works?.filter((book: Book) => book.cover_i).slice(0, 6) || [];

  return booksWithCovers;
};

export const fetchGenreBooks = async (genre: string): Promise<GenreBook[]> => {
  const response = await axiosInstance.get(
    `subjects/${genre.toLowerCase()}.json`,
    {
      params: {
        limit: 100,
      },
    }
  );

  return response.data.works.filter((book: GenreBook) =>
    Boolean(book.cover_id)
  );
};
