import { Journal } from "./Journal";

export interface ShelfBook {
  bookKey: string;
  updatedAt: string;
}

export interface User {
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
  createdAt: string;
  updatedAt: string;

  journals: Journal[];
}

export interface UpdateUserProfileDto {
  fullName?: string;
  bio?: string;
  profilePic?: string;
}

export interface UpdateUserStatsDto {
  yearlyGoal?: number;
  completedCount?: number;
  ongoingCount?: number;
  wantToReadCount?: number;
  booksReadThisYear?: string[];
  avgRating?: number;
  totalJournals?: number;
}

export interface UpdateUserProfileDto {
  fullName?: string;
  bio?: string;
  profilePic?: string;
}

export interface UpdateUserStatsDto {
  yearlyGoal?: number;
  completedCount?: number;
  ongoingCount?: number;
  wantToReadCount?: number;
  booksReadThisYear?: string[];
  avgRating?: number;
  totalJournals?: number;
}
