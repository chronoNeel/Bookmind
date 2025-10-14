export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  role: "user" | "admin";
  updatedAt?: string;
}

export interface CreateUserDto {
  displayName: string;
  email: string;
}

export interface UpdateUserDto {
  displayName?: string;
  email?: string;
}
