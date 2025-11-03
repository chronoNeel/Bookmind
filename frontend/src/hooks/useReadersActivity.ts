import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getAllActivites } from "@/store/slices/activitySlice";
import { fetchUserProfile } from "@/store/slices/userSlice";
import { activity } from "@/models/activity";

export type activityDetails = activity & {
  bookTitle: string;
  userFullName: string;
  userName: string;
  userProfilePic: string;
};

export const useReadersActivity = () => {
  const { activities, loading, error } = useAppSelector(
    (state) => state.activity
  );
  const dispatch = useAppDispatch();

  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [detailedActivities, setDetailedActivities] = useState<
    activityDetails[]
  >([]);

  useEffect(() => {
    dispatch(getAllActivites());
  }, [dispatch]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (activities.length === 0) return;
      setIsLoadingUsers(true);

      try {
        const sorted = [...activities]
          .sort(
            (a, b) =>
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          )
          .slice(0, 3);

        const details = await Promise.all(
          sorted.map(async (act) => {
            try {
              const user = await dispatch(fetchUserProfile(act.uid)).unwrap();
              const res = await fetch(
                `https://openlibrary.org${act.bookKey}.json`
              );
              const book = res.ok ? await res.json() : {};
              return {
                ...act,
                bookTitle: book.title || "Unknown Title",
                userFullName: user.fullName || "Unknown User",
                userName: user.userName || "Unknown username",
                userProfilePic: user.profilePic,
              };
            } catch {
              return {
                ...act,
                bookTitle: "Unknown Title",
                userFullName: "Unknown User",
                userName: "Unknown username",
                userProfilePic: "",
              };
            }
          })
        );

        setDetailedActivities(details.filter(Boolean));
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchDetails();
  }, [activities, dispatch]);

  return { detailedActivities, loading, isLoadingUsers, error };
};
