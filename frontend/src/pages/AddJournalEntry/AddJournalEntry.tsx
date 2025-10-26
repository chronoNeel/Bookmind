import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import MoodSelector from "./Components/MoodSelector";
import StarRating from "./Components/StarRating";
import ReadingProgress from "./Components/ReadingProgress";
import GuidedPrompts from "./Components/GuidedPrompts";
import JournalTextarea from "./Components/JournalTextarea";
import ActionButtons from "./Components/ActionButtons";
import HeaderCard from "./Components/HeaderCard";
import { BookDetails } from "../../types/Book";
import JournalEntry from "../../types/JournalEntry";
import {
  createJournalEntry,
  fetchJournalById,
  updateJournalEntry,
} from "../../store/slices/journalSlice";

const AddJournalEntry: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const bookKey = location.state?.bookKey;
  const { journalId } = useParams();
  const isEditMode = Boolean(journalId);
  const { currentJournal } = useAppSelector((state) => state.journal);

  const [book, setBook] = useState<BookDetails>({
    key: "",
    title: "",
    description: "",
    covers: [],
    subjects: [],
    first_publish_date: "",
    authors: [],
  });
  const [authorName, setAuthorName] = useState("Unknown Author");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [entry, setEntry] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedMood, setSelectedMood] = useState("");
  const [expandedPrompts, setExpandedPrompts] = useState<
    Record<string, boolean>
  >({});
  const [promptResponses, setPromptResponses] = useState<
    Record<string, string>
  >({});

  // Load journal if editing
  useEffect(() => {
    if (journalId) dispatch(fetchJournalById(journalId));
  }, [dispatch, journalId]);

  // Populate form with existing journal data
  useEffect(() => {
    if (isEditMode && currentJournal) {
      setBook({
        key: currentJournal.bookKey,
        title: currentJournal.bookTitle,
        first_publish_date: currentJournal.bookPublishYear,
      });
      setAuthorName(currentJournal.bookAuthor);
      setRating(currentJournal.rating);
      setReadingProgress(currentJournal.readingProgress);
      setIsPrivate(currentJournal.isPrivate);
      setSelectedMood(currentJournal.mood);
      setPromptResponses(currentJournal.promptResponses);
      setEntry(currentJournal.entry);
      setLoading(false);
    }
  }, [isEditMode, currentJournal]);

  // Fetch book details if creating a new entry
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (isEditMode) return;

      if (!bookKey) {
        setError("No book key provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const bookResponse = await axios.get(
          `https://openlibrary.org${bookKey}.json`
        );
        const bookData: BookDetails = bookResponse.data;

        let fetchedAuthorName = "Unknown Author";
        const authorKey = bookData.authors?.[0]?.author?.key;
        if (authorKey) {
          try {
            const authorRes = await axios.get(
              `https://openlibrary.org${authorKey}.json`
            );
            fetchedAuthorName = authorRes.data?.name || "Unknown Author";
          } catch {
            /* ignore author fetch errors */
          }
        }

        setBook(bookData);
        setAuthorName(fetchedAuthorName);
      } catch {
        setError("Failed to load book details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookKey, isEditMode]);

  // Memoized cover URL (null instead of empty string)
  const memoizedCoverUrl = useMemo(() => {
    const id = book?.covers?.[0];
    return id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : null;
  }, [book?.covers]);

  const coverUrl = isEditMode
    ? currentJournal?.bookCoverUrl || null
    : memoizedCoverUrl;

  const getStatusText = () => {
    if (readingProgress === 0) return "Want to Read";
    if (readingProgress === 100) return "Completed";
    return "Currently Reading";
  };

  const handleSave = async () => {
    setIsSaving(true);

    const payload: JournalEntry = {
      bookKey: bookKey || currentJournal?.bookKey,
      bookTitle: book.title,
      bookAuthor: authorName,
      bookCoverUrl: coverUrl || "",
      bookPublishYear: book.first_publish_date || "",
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

    try {
      if (isEditMode && journalId) {
        await dispatch(updateJournalEntry({ id: journalId, data: payload }));
        toast.success("Journal entry updated successfully!");
      } else {
        await dispatch(createJournalEntry(payload)).unwrap();
        toast.success("Journal entry saved successfully!");
      }
      navigate(-1);
    } catch {
      toast.error("Failed to save journal entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  if (error)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

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
          book={book}
          coverUrl={coverUrl} // can be null safely
          author={authorName}
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
