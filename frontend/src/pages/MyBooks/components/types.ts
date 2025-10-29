import { LucideIcon } from "lucide-react";
import { ShelfBook } from "@models/user";

export interface Book {
  title: string;
  author: string;
  workKey: string;
  coverUrl: string;
  subject: string;
}

export interface ShelfState {
  read: string[];
  currentlyReading: string[];
  wantToRead: string[];
}

export interface ExpandedShelfState {
  completed: boolean;
  ongoing: boolean;
  wantToRead: boolean;
}

export interface BookCardProps {
  book: Book;
}

export interface EmptyShelfProps {
  message: string;
}

export interface ShelfProps {
  title: string;
  shelfBooks: ShelfBook[];
  icon: LucideIcon;
  color: string;
  shelfKey: keyof ExpandedShelfState;
  isExpanded: boolean;
  onToggle: () => void;
}
