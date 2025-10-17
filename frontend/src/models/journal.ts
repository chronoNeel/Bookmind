export interface Journal {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  rating: number;
  mood: string;
  progress: number;
  promptResponses: { prompt: string; answer: string }[];
  entryText: string;
  upvotes: number;
  downvotes: number;
  upvotedBy: string[];
  downvotedBy: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}
