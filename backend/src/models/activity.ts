import { BookStatus } from "./Books";

export type actionType = "add_to_shelf" | "add_to_journal";

export interface activity {
  uid: string;
  action: actionType;
  shelfStatus?: BookStatus;
  journalId?: string;
  rating?: number;
  bookKey: string;
  addedAt: string;
}
