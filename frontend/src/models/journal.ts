import JournalEntry from "../types/JournalEntry";

export type Journal = JournalEntry & {
  id: string;
  userId: string;
};
