import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "@store";
import { useAppDispatch } from "@hooks/redux";
import { updateFavoriteBooks } from "@store/slices/statsSlice";
import { isAuthRequired } from "@/utils/authHelpers";
import { getErrorMessage } from "@/utils/errorHelper";

export const useBookFavorite = (bookKey: string) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(currentUser?.favorites?.includes(bookKey) ?? false);
  }, [currentUser?.favorites, bookKey]);

  const redirectToLogin = (message?: string) => {
    toast.warn(message || "Please log in to continue.", {
      position: "top-center",
    });
    setTimeout(
      () => navigate("/login", { state: { from: `/book/${bookKey}` } }),
      1500
    );
  };

  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      return redirectToLogin("Please log in to manage favorites.");
    }

    try {
      const result = await dispatch(updateFavoriteBooks({ bookKey })).unwrap();
      const isNowFavorite = result.favorites.includes(bookKey);
      setIsFavorite(isNowFavorite);
      toast.success(
        isNowFavorite ? "Added to favorites!" : "Removed from favorites!",
        { position: "top-right" }
      );
    } catch (error: unknown) {
      if (isAuthRequired(error)) {
        const msg =
          getErrorMessage(error) ||
          "Please log in to continue. Redirect to login?";
        if (window.confirm(msg)) {
          navigate("/login", { state: { from: `/book/${bookKey}` } });
        }
      } else {
        toast.error("Failed to update favorites. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  return {
    isFavorite,
    handleFavoriteToggle,
  };
};
