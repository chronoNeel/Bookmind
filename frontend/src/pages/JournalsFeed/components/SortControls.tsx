import { useAppDispatch } from "@/hooks/redux";
import { fetchNameByUid } from "@/store/slices/userSlice";
import { useEffect, useState } from "react";

interface SortControlsProps {
  sortBy: "recent" | "rating" | "votes";
  setSortBy: (sort: "recent" | "rating" | "votes") => void;
  userId?: string;
}

const SortControls = ({ sortBy, setSortBy, userId }: SortControlsProps) => {
  const dispatch = useAppDispatch();
  const [userFullName, setUserFullName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      setUserFullName("");
      return;
    }

    let isMounted = true;

    const loadUserName = async () => {
      setIsLoading(true);
      try {
        const userData = await dispatch(fetchNameByUid(userId)).unwrap();
        if (isMounted) {
          setUserFullName(userData.fullName);
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.log(err.message);
        setIsLoading(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUserName();

    return () => {
      isMounted = false;
    };
  }, [dispatch, userId]);

  const displayTitle = userId
    ? isLoading
      ? "Loading ..."
      : `${userFullName}'s Journals`
    : "Journal Feed";

  return (
    <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-serif text-slate-900">{displayTitle}</h1>
      </div>

      <div className="flex items-center gap-2 md:w-auto">
        <label
          htmlFor="sortBy"
          className="text-sm text-slate-600 whitespace-nowrap shrink-0"
        >
          Sort by
        </label>

        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "recent" | "rating" | "votes")
          }
          className="rounded-full border border-amber-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <option value="recent">Recent</option>
          <option value="rating">Rating</option>
          <option value="votes">Votes</option>
        </select>
      </div>
    </div>
  );
};

export default SortControls;
