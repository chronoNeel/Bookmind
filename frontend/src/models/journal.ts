import JournalEntry from "./JournalEntry";

export type Journal = JournalEntry & {
  id: string;
  userId: string;
};
