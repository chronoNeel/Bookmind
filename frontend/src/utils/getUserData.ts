import { useAppSelector } from "../hooks/redux";

export const getCurrentUser = () => {
  const currentUser = useAppSelector((state) => state.auth.user);

  return currentUser;
};

export const booksReadThisYear = () => {
  const currentUser = useAppSelector((state) => state.auth.user);

  if (!currentUser?.shelves.completed) return 0;

  const currentYear = new Date().getFullYear();

  return currentUser.shelves.completed.filter((book) => {
    const bookYear = new Date(book.updatedAt).getFullYear();
    return bookYear === currentYear;
  }).length;
};
