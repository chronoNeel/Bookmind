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
    yearlyGoal: number;
    booksReadThisYear: string[];
  };
  journals: Journal[];
  createdAt: string;
}

export interface AuthState {
  user: UserData;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  usernameCheck: {
    checking: boolean;
    available: boolean | null;
    error: string | null;
  };
}
