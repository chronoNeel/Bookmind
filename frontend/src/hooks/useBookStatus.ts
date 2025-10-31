import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "@store";
import { useAppDispatch } from "@hooks/redux";
import { setBookStatus } from "@store/slices/shelfSlice";
import { getBookShelf } from "@utils/getBookData";
import { StatusValue } from "@models/StatusModal";
import { isAuthRequired } from "@/utils/authHelpers";
import { getErrorMessage } from "@/utils/errorHelper";

export const useBookStatus = (bookKey: string) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [status, setStatus] = useState<StatusValue>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync status with user shelves
  useEffect(() => {
    if (currentUser?.shelves) {
      setStatus(getBookShelf({ shelves: currentUser.shelves, bookKey }));
    }
  }, [currentUser?.shelves, bookKey]);

  const redirectToLogin = (message?: string) => {
    setIsModalOpen(false);
    toast.warn(message || "Please log in to continue.", {
      position: "top-center",
    });
    setTimeout(
      () => navigate("/login", { state: { from: `/book/${bookKey}` } }),
      1500
    );
  };

  const handleStatusChange = async (newStatus: StatusValue) => {
    if (!currentUser) {
      return redirectToLogin("Please log in to add books to your shelves.");
    }

    try {
      const statusValue = newStatus === "remove" ? null : newStatus;
      await dispatch(setBookStatus({ bookKey, status: statusValue })).unwrap();
      setStatus(statusValue);

      const statusLabels = {
        wantToRead: "Want to Read",
        ongoing: "Ongoing",
        completed: "Completed",
      } as const;

      const message = statusValue
        ? `Added to ${statusLabels[statusValue]} shelf`
        : "Removed from your shelves";

      toast.success(message, { position: "top-right" });
      setIsModalOpen(false);
    } catch (error: unknown) {
      if (isAuthRequired(error)) {
        const msg =
          getErrorMessage(error) ||
          "Please log in to continue. Redirect to login?";
        if (window.confirm(msg)) {
          navigate("/login", { state: { from: `/book/${bookKey}` } });
        }
        setIsModalOpen(false);
      } else {
        toast.error("Failed to update book status. Please try again.");
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    status,
    isModalOpen,
    handleStatusChange,
    openModal,
    closeModal,
  };
};
