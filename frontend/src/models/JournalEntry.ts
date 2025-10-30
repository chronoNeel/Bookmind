export default interface JournalEntry {
  bookKey: string;
  bookTitle: string;
  bookAuthorList: string[];
  bookCoverUrl: string;

  rating: number;
  readingProgress: number;
  isPrivate: boolean;
  mood: string;
  promptResponses: {
    [key: string]: string;
  };
  entry: string;

  userId?: string;

  upvotedBy: string[];
  downvotedBy: string[];

  createdAt: string;
  updatedAt: string;
}
