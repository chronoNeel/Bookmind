import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import MoodSelector from "./Components/MoodSelector";
import StarRating from "./Components/StarRating";
import ReadingProgress from "./Components/ReadingProgress";
import GuidedPrompts from "./Components/GuidedPrompts";
import JournalTextarea from "./Components/JournalTextarea";
import ActionButtons from "./Components/ActionButtons";
import HeaderCard from "./Components/HeaderCard";
import JournalEntry from "@models/JournalEntry";
import { fetchJournalById } from "@store/slices/journalSlice";
import { useBookData } from "@hooks/useBookData";
import { useJournalSave } from "../../hooks/useJournalSave";
import LoadingSpinner from "./Components/LoadingSpinner";
import ErrorDisplay from "./Components/ErrorDisplay";
import { useJournalForm } from "@hooks/useJournalForm";

const AddJournalEntry: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentJournal } = useAppSelector((state) => state.journal);
  const { journalId } = useParams();
  const isEditMode = Boolean(journalId);

  const bookKey = location.state?.bookKey || currentJournal?.bookKey;

  const [hoverRating, setHoverRating] = useState(0);
  const [expandedPrompts, setExpandedPrompts] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (journalId) dispatch(fetchJournalById(journalId));
  }, [dispatch, journalId]);

  const { title, authors, coverUrl, loading, error } = useBookData(bookKey);
  const { isSaving, handleJournalSave } = useJournalSave();

  const {
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
  } = useJournalForm(currentJournal, isEditMode);

  const displayCoverUrl = isEditMode
    ? currentJournal?.bookCoverUrl || null
    : coverUrl;

  const getStatusText = () => {
    if (readingProgress === 0) return "Want to Read";
    if (readingProgress === 100) return "Completed";
    return "Currently Reading";
  };

  const handleSave = async () => {
    const payload: JournalEntry = {
      bookKey: bookKey || currentJournal?.bookKey,
      bookTitle: title,
      bookAuthorList: authors,
      bookCoverUrl: coverUrl || "",
      rating,
      readingProgress,
      isPrivate,
      mood: selectedMood,
      promptResponses,
      entry,
      upvotedBy: [],
      downvotedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    handleJournalSave(payload, journalId, isEditMode);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div
      className="min-vh-100 p-3 p-md-4"
      style={{
        background: "linear-gradient(135deg, #fffaea 50%, #fef3e2 100%)",
        position: "relative",
      }}
    >
      <div className="container max-w-3xl mx-auto position-relative">
        <HeaderCard
          title={title}
          coverUrl={displayCoverUrl}
          author={authors.join(", ")}
          readingProgress={readingProgress}
          getStatusText={getStatusText}
        />

        <div
          className="rounded-3 shadow-sm p-4 p-md-5 mt-4"
          style={{
            background: "linear-gradient(135deg, #fff9f0 0%, #fff 100%)",
            border: "1px solid rgba(253, 230, 138, 0.5)",
          }}
        >
          <MoodSelector
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
          <StarRating
            rating={rating}
            hoverRating={hoverRating}
            setRating={setRating}
            setHoverRating={setHoverRating}
          />
          <ReadingProgress
            progress={readingProgress}
            setProgress={setReadingProgress}
          />
          <GuidedPrompts
            expandedPrompts={expandedPrompts}
            setExpandedPrompts={setExpandedPrompts}
            promptResponses={promptResponses}
            setPromptResponses={setPromptResponses}
          />
          <JournalTextarea
            entry={entry}
            setEntry={setEntry}
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
          />
          <ActionButtons
            isSaving={isSaving}
            onSave={handleSave}
            onCancel={() => navigate(-1)}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </div>
  );
};

export default AddJournalEntry;
