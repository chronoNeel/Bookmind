export type BookStatus = "want-to-read" | "reading" | "completed";

export interface Book {
  id?: string;
  userId: string;
  title: string;
  author: string;
  description?: string;
  status: BookStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  description?: string;
  status?: BookStatus;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  description?: string;
  status?: BookStatus;
}
