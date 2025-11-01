// components/JournalCard/JournalCard.tsx
import { motion } from "framer-motion";
import { useAppDispatch } from "@/hooks/redux";
import { Journal } from "@/models/journal";
import { fetchNameByUid } from "@/store/slices/authSlice";
import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";

import JournalHeader from "./JournalHeader";
import RatingStars from "./RatingStars";
import Badge from "./Badge";
import JournalMeta from "./JournalMeta";
import JournalActions from "./JournalActions";
import { feelingBadgeStyles } from "./feelingBadgeStyles";

const JournalCard = memo(({ entry }: { entry: Journal }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [journalAuthorFullName, setJournalAuthorFullName] = useState("");
  const [journalAuthorUserName, setJournalAuthorUserName] = useState("");
  const [journalAuthorProfilePic, setJournalAuthorProfilePic] = useState("");

  useEffect(() => {
    const loadAuthor = async () => {
      if (entry?.userId) {
        try {
          const userData = await dispatch(
            fetchNameByUid(entry.userId)
          ).unwrap();
          setJournalAuthorFullName(userData.fullName);
          setJournalAuthorUserName(userData.userName);
          setJournalAuthorProfilePic(userData.profilePic);
        } catch {
          setJournalAuthorFullName("Unknown Author");
        }
      }
    };
    loadAuthor();
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
          <img
            src={entry.bookCoverUrl || "https://via.placeholder.com/180x270"}
            alt={`${entry.bookTitle} cover`}
            className="h-full w-full object-cover md:h-[320px]"
            loading="lazy"
          />
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
            authorFullName={journalAuthorFullName}
            authorUserName={journalAuthorUserName}
            authorProfilePic={journalAuthorProfilePic}
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
