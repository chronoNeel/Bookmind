import { ShelfBook } from "../models/user";

export type ShelfType = "completed" | "ongoing" | "wantToRead";

interface GetBookShelfProps {
  shelves: Record<ShelfType, ShelfBook[]>;
  bookKey: string;
}

export const getBookShelf = ({
  shelves,
  bookKey,
}: GetBookShelfProps): ShelfType | null => {
  for (const [shelfName, books] of Object.entries(shelves) as [
    ShelfType,
    ShelfBook[]
  ][]) {
    const bookExists = books.some((book) => book.bookKey === bookKey);

    if (bookExists) {
      return shelfName;
    }
  }
  return null;
};
