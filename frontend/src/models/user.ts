import { Journal } from "./journal";

export interface ShelfBook {
  bookKey: string;
  updatedAt: string;
}

export interface UserData {
  uid: string;
  email: string;
  fullName: string;
  userName: string;
  bio: string;
  profilePic: string;
  followers: string[];
  following: string[];
  favorites: string[];
  shelves: {
    completed: ShelfBook[];
    ongoing: ShelfBook[];
    wantToRead: ShelfBook[];
  };
  stats: {
    completedCount: number;
    ongoingCount: number;
    wantToReadCount: number;
    yearlyGoal: number;
    booksReadThisYear: string[];
    avgRating: number;
    totalJournals: number;
  };
  journals: Journal[];
  createdAt: string;
}

export interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
