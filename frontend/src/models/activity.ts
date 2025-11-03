export type actionType = "add_to_shelf" | "add_to_journal";

export interface activity {
  id: string;
  uid: string;
  action: actionType;
  shelfStatus?: "want-to-read" | "reading" | "completed";
  journalId?: string;
  rating?: number;
  bookKey: string;
  addedAt: string;
}
