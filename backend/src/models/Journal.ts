export interface PromptResponse {
  prompt: string;
  answer: string;
}

export type Journal = JournalEntry & {
  id: string;
  userId: string;
};

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
