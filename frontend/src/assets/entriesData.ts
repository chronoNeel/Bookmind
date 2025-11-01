// types.ts
export interface Book {
  key: string;
  title: string;
  author_name: string[];
  first_publish_year: number;
  cover_i: number;
}

export interface PromptResponses {
  summary: string;
  character: string;
  change: string;
  quote: string;
}

export interface ReadingEntry {
  book: Book;
  id: string;
  createdAt: string;
  updatedAt: string;
  mood: string;
  rating: number;
  readingProgress: number;
  isPrivate: boolean;
  entry: string;
  promptResponses: PromptResponses;
  upvotes: number;
  downvotes: number;
}
