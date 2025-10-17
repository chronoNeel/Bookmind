export interface PromptResponse {
  prompt: string;
  answer: string;
}

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
  promptResponses: PromptResponse[];
  entryText: string;

  upvotes: number;
  downvotes: number;

  upvotedBy: string[];
  downvotedBy: string[];

  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateJournalDto {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  rating: number;
  mood: string;
  progress: number;
  entryText: string;
  prompts: PromptResponse[];
  isPublic?: boolean;
}

export interface UpdateJournalDto {
  rating?: number;
  mood?: string;
  progress?: number;
  entryText?: string;
  prompts?: PromptResponse[];
  isPublic?: boolean;
}

export interface VoteJournalDto {
  voteType: "upvote" | "downvote" | "remove";
}
