import { useEffect, useState } from "react";
import JournalEntry from "../models/JournalEntry";

export const useJournalForm = (
  currentJournal: JournalEntry | null,
  isEditMode: boolean
) => {
  const [rating, setRating] = useState<number>(0);
  const [entry, setEntry] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [promptResponses, setPromptResponses] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (isEditMode && currentJournal) {
      setRating(currentJournal.rating ?? 0);
      setReadingProgress(currentJournal.readingProgress ?? 0);
      setIsPrivate(currentJournal.isPrivate);
      setSelectedMood(currentJournal.mood ?? "");
      setPromptResponses(currentJournal.promptResponses ?? {});
      setEntry(currentJournal.entry ?? "");
    }
  }, [isEditMode, currentJournal]);

  return {
    rating,
    setRating,
    entry,
    setEntry,
    readingProgress,
    setReadingProgress,
    isPrivate,
    setIsPrivate,
    selectedMood,
    setSelectedMood,
    promptResponses,
    setPromptResponses,
  };
};
