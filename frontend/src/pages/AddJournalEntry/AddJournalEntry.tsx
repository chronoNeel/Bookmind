import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch } from "../../hooks/redux";
import { addJournal } from "../../store/slices/journalSlice";
import MoodSelector from "./Components/MoodSelector";
import StarRating from "./Components/StarRating";
import ReadingProgress from "./Components/ReadingProgress";
import GuidedPrompts from "./Components/GuidedPrompts";
import JournalTextarea from "./Components/JournalTextarea";
import ActionButtons from "./Components/ActionButtons";
import HeaderCard from "./Components/HeaderCard";

export interface Book {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  authors?: { author: { key: string } }[];
}

const AddJournalEntry: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const bookKey = location.state?.bookKey;

  const [book, setBook] = useState<Book>({
    key: "",
    title: "",
    description: "",
    covers: [],
    subjects: [],
    first_publish_date: "",
    authors: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [entry, setEntry] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedMood, setSelectedMood] = useState("");
  const [expandedPrompts, setExpandedPrompts] = useState({});
  const [promptResponses, setPromptResponses] = useState({});

  useEffect(() => {
    const getBookDetails = async () => {
      if (!bookKey) {
        setError("No book key provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch only the book details needed for the journal entry
        const bookResponse = await axios.get(
          `https://openlibrary.org${bookKey}.json`
        );
        const bookData = bookResponse.data;

        // Fetch author name if available
        let authorName = "Unknown Author";
        if (bookData.authors?.length) {
          try {
            const authorKey = bookData.authors[0].author.key;
            const authorResponse = await axios.get(
              `https://openlibrary.org${authorKey}.json`
            );
            authorName = authorResponse.data.name || "Unknown Author";
          } catch (authorError) {
            console.error("Error fetching author:", authorError);
          }
        }

        // Set the book data with author name
        setBook({
          ...bookData,
          authorName,
        });
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getBookDetails();
  }, [bookKey]);

  const coverUrl = useMemo(
    () =>
      book?.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
        : "",
    [book?.covers]
  );

  const getStatusText = () => {
    if (readingProgress === 0) return "Want to Read";
    if (readingProgress === 100) return "Completed";
    return "Currently Reading";
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((res) => setTimeout(res, 1000));
    dispatch(
      addJournal({
        book,
        rating,
        readingProgress,
        entry,
        isPrivate,
        mood: selectedMood,
        promptResponses,
      })
    );
    setIsSaving(false);
    navigate("/");
  };

  const handleCancel = () => navigate("/search-results");

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 position-relative overflow-hidden p-3 p-md-4"
      style={{
        background: "linear-gradient(135deg, #fffaea 50%, #fef3e2 100%)",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          pointerEvents: "none",
          opacity: 0.3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <div className="position-relative z-1 container max-w-3xl mx-auto">
        <HeaderCard
          book={book}
          coverUrl={coverUrl}
          readingProgress={readingProgress}
          getStatusText={getStatusText}
        />

        <div
          className="rounded-3 shadow-sm p-4 p-md-5 mb-4"
          style={{
            background: "linear-gradient(135deg, #fff9f0 0%, #fff 100%)",
            border: "1px solid rgba(253, 230, 138, 0.5)",
            borderRadius: "15px",
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
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default AddJournalEntry;
