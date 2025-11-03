import { motion } from "framer-motion";
import { useAppDispatch } from "@/hooks/redux";
import { Journal } from "@/models/journal";
import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";

import JournalHeader from "./JournalHeader";
import RatingStars from "./RatingStars";
import Badge from "./Badge";
import JournalMeta from "./JournalMeta";
import JournalActions from "./JournalActions";
import { feelingBadgeStyles } from "./feelingBadgeStyles";
import { fetchUserProfile } from "@/store/slices/userSlice";

const JournalCard = memo(({ entry }: { entry: Journal }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [author, setAuthor] = useState<{
    fullName: string;
    userName: string;
    profilePic?: string;
  }>({
    fullName: "Loading...",
    userName: "",
    profilePic: "",
  });

  useEffect(() => {
    let isMounted = true;
    const loadAuthor = async () => {
      if (!entry?.userId) return;

      try {
        const userData = await dispatch(
          fetchUserProfile(entry.userId)
        ).unwrap();
        if (isMounted) {
          setAuthor({
            fullName: userData.fullName || "Unknown Author",
            userName: userData.userName || "",
            profilePic: userData.profilePic || "",
          });
        }
      } catch {
        if (isMounted) {
          setAuthor({
            fullName: "Unknown Author",
            userName: "",
            profilePic: "",
          });
        }
      }
    };
    loadAuthor();
    return () => {
      isMounted = false;
    };
  }, [entry?.userId, dispatch]);

  const readingStatus = entry.readingProgress === 100 ? "Completed" : "Ongoing";
  const readingBadgeColor =
    readingStatus === "Completed"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-blue-50 text-blue-700 ring-blue-200";
  const feelingClass = feelingBadgeStyles[entry.mood || "Neutral"];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
        <div className="relative">
          <div className="relative bg-slate-100">
            {entry.bookCoverUrl ? (
              <img
                src={entry.bookCoverUrl}
                alt={`${entry.bookTitle} cover`}
                className="h-full w-full object-cover md:h-[320px]"
                loading="lazy"
                onClick={() =>
                  navigate(`/book/${encodeURIComponent(entry.bookKey)}`)
                }
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
            ) : null}
            <div
              className={`${
                entry.bookCoverUrl ? "hidden" : ""
              } h-full w-full md:h-[320px] flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100`}
            >
              <div className="text-center p-4">
                <div className="text-4xl mb-2">📚</div>
                <div className="text-xs text-slate-600 font-medium">
                  No Cover
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 md:p-6">
          <JournalHeader
            title={entry.bookTitle}
            authors={entry.bookAuthorList || []}
          />

          <div className="flex flex-wrap items-center gap-2">
            {entry.rating > 0 && <RatingStars value={entry.rating} />}
            <Badge className={readingBadgeColor}>{readingStatus}</Badge>
            {entry.mood && <Badge className={feelingClass}>{entry.mood}</Badge>}
          </div>

          <p className="text-[15px] leading-7 text-slate-800 line-clamp-4 md:line-clamp-5">
            {entry.entry}
          </p>
          <button
            className="self-start text-sm font-medium text-slate-700 hover:text-slate-900 underline-offset-4 hover:underline"
            onClick={() => navigate(`/journal-preview/${entry.id}`)}
          >
            See more →
          </button>

          <JournalMeta
            authorFullName={author.fullName}
            authorUserName={author.userName}
            authorProfilePic={author.profilePic}
            createdAt={entry.createdAt}
            isPrivate={entry.isPrivate}
          />

          <JournalActions
            journalId={entry.id}
            upvotedBy={entry.upvotedBy}
            downvotedBy={entry.downvotedBy}
          />
        </div>
      </div>
    </motion.article>
  );
});

JournalCard.displayName = "JournalCard";
export default JournalCard;
