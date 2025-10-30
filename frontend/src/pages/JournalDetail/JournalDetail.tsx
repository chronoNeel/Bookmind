import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { RootState } from "../../store";
import {
  fetchJournalById,
  upvoteJournal,
  downvoteJournal,
} from "@store/slices/journalSlice";
import { fetchNameByUid } from "@store/slices/authSlice";
import { toast } from "react-toastify";

import { JournalContent } from "./component/JournalContent";
import { JournalError } from "./component/JournalError";
import { JournalHeader } from "./component/JournalHeader";
import { JournalPrompts } from "./component/JournalPrompts";
import { JournalEntry } from "./component/JournalEntry";
import { JournalActions } from "./component/JournalActions";
import { JournalLoader } from "./component/JournalLoader";

const JournalDetail: React.FC = () => {
  const { journalId } = useParams<{ journalId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentJournal, loading, error } = useAppSelector(
    (state: RootState) => state.journal
  );
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const authLoading = useAppSelector((state: RootState) => state.auth.loading);

  const [authorFullName, setAuthorFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!authLoading) setAuthChecked(true);
  }, [authLoading]);

  useEffect(() => {
    if (journalId && authChecked) dispatch(fetchJournalById(journalId));
  }, [dispatch, journalId, authChecked]);

  useEffect(() => {
    const loadAuthor = async () => {
      if (currentJournal?.userId) {
        try {
          const userData = await dispatch(
            fetchNameByUid(currentJournal.userId)
          ).unwrap();
          setAuthorFullName(userData.fullName);
          setUserName(userData.userName);
        } catch {
          setAuthorFullName("Unknown Author");
        }
      }
    };
    loadAuthor();
  }, [currentJournal?.userId, dispatch]);

  const hasUpvoted = Boolean(
    currentUser && currentJournal?.upvotedBy?.includes(currentUser.uid)
  );
  const hasDownvoted = Boolean(
    currentUser && currentJournal?.downvotedBy?.includes(currentUser.uid)
  );

  const handleVote = async (type: "up" | "down") => {
    if (!currentUser) {
      toast.warn("Please log in to vote!", { position: "top-center" });
      return;
    }
    if (!journalId) return;
    setIsVoting(true);
    try {
      await dispatch(
        type === "up" ? upvoteJournal(journalId) : downvoteJournal(journalId)
      ).unwrap();
      await dispatch(fetchJournalById(journalId));
      toast.success(
        type === "up"
          ? hasUpvoted
            ? "Upvote removed!"
            : "Journal upvoted!"
          : hasDownvoted
          ? "Downvote removed!"
          : "Journal downvoted!"
      );
    } catch {
      toast.error("Failed to vote. Try again.");
    } finally {
      setIsVoting(false);
    }
  };

  if (!authChecked || (loading && !currentJournal)) return <JournalLoader />;
  if (error || !currentJournal)
    return <JournalError error={error} navigate={navigate} />;

  const isOwner = currentUser?.uid === currentJournal.userId;

  return (
    <JournalContent>
      <JournalHeader
        journal={currentJournal}
        authorFullName={authorFullName}
        userName={userName}
      />

      <JournalPrompts promptResponses={currentJournal.promptResponses} />
      <JournalEntry entry={currentJournal.entry} />
      <JournalActions
        isPrivate={currentJournal.isPrivate}
        upvotedBy={currentJournal.upvotedBy || []}
        downvotedBy={currentJournal.downvotedBy || []}
        hasUpvoted={hasUpvoted}
        hasDownvoted={hasDownvoted}
        isVoting={isVoting}
        handleVote={handleVote}
        isOwner={isOwner}
        navigate={navigate}
        journalId={journalId!}
      />
    </JournalContent>
  );
};

export default JournalDetail;
