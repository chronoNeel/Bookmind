import { Book } from "./Book";

export default interface JournalEntry {
  id: string;
  book: Book;
  rating?: number;
  readingProgress?: number;
  isPrivate: boolean;
  mood: string;
  promptResponses: {
    [key: string]: string;
  };
  entry: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
}
