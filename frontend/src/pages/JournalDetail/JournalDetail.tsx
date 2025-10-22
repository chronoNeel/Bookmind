// src/pages/JournalDetail/JournalDetail.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Lock,
  Globe,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import JournalPDFExporter from "./component/JournalPdfExporter";
import {
  downvoteJournal,
  fetchJournalById,
  upvoteJournal,
} from "../../store/slices/journalSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { RootState } from "../../store";
import { fetchUsernameByUid } from "../../store/slices/authSlice";
import { getCurrentUser } from "../../utils/getUserData";
import { toast } from "react-toastify";

const JournalDetail = () => {
  const { journalId } = useParams<{ journalId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentJournal, loading, error } = useAppSelector(
    (state: RootState) => state.journal
  );

  const currentUser = getCurrentUser();
  const [userName, setUserName] = useState<string>("");
  const [loadingAuthor, setLoadingAuthor] = useState(false);

  // Fetch author name
  useEffect(() => {
    const fetchAuthor = async () => {
      if (currentJournal?.userId) {
        setLoadingAuthor(true);
        try {
          const result = await dispatch(
            fetchUsernameByUid(currentJournal.userId)
          );
          setUserName(result.payload as string);
        } catch (err) {
          console.error("Failed to fetch author:", err);
          setUserName("Unknown User");
        } finally {
          setLoadingAuthor(false);
        }
      }
    };

    fetchAuthor();
  }, [currentJournal?.userId, dispatch]);

  // Load the journal when the component mounts
  useEffect(() => {
    if (journalId) {
      dispatch(fetchJournalById(journalId));
    }
  }, [dispatch, journalId]);

  // Check if current user has voted
  const hasUpvoted =
    currentUser && currentJournal?.upvotedBy?.includes(currentUser?.uid);
  const hasDownvoted =
    currentUser && currentJournal?.downvotedBy?.includes(currentUser?.uid);

  const handleUpvote = async () => {
    if (!currentUser) {
      toast.warn("Please log in to vote on journals!", {
        position: "top-center",
      });
      return;
    }

    if (!journalId) {
      toast.error("Journal ID not found!", { position: "top-center" });
      return;
    }

    try {
      await dispatch(upvoteJournal(journalId)).unwrap();

      // ✅ Refetch the updated journal to get the latest vote counts
      await dispatch(fetchJournalById(journalId));

      if (hasUpvoted) {
        toast.info("Upvote removed!", { position: "bottom-center" });
      } else {
        toast.success("Journal upvoted!", { position: "bottom-center" });
      }
    } catch (err) {
      console.error("Failed to upvote:", err);
      toast.error("Failed to upvote. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  const handleDownvote = async () => {
    if (!currentUser) {
      toast.warn("Please log in to vote on journals!", {
        position: "top-center",
      });
      return;
    }

    if (!journalId) return;

    try {
      await dispatch(downvoteJournal(journalId)).unwrap();

      // ✅ Refetch the updated journal to get the latest vote counts
      await dispatch(fetchJournalById(journalId));

      if (hasDownvoted) {
        toast.info("Downvote removed!", { position: "bottom-center" });
      } else {
        toast.success("Journal downvoted!", { position: "bottom-center" });
      }
    } catch (err) {
      console.error("Failed to downvote:", err);
      toast.error("Failed to downvote. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  if (loading && !currentJournal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading journal...</p>
        </div>
      </div>
    );
  }

  if (error || !currentJournal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-700">
        <p className="text-xl mb-2">{error || "Journal not found."}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-amber-200 rounded-lg hover:bg-amber-300 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    bookKey,
    bookTitle,
    bookAuthor,
    bookCoverUrl,
    rating,
    mood,
    promptResponses,
    entry,
    isPrivate,
    readingProgress,
    createdAt,
    upvotedBy = [],
    downvotedBy = [],
  } = currentJournal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800 p-6 md:p-10 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' ... %3E")`,
        }}
      ></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&family=Patrick+Hand&family=Shadows+Into+Light&display=swap');
        .handwritten-title { font-family: 'Indie Flower', cursive; }
        .handwritten-text { font-family: 'Patrick Hand', cursive; }
        .handwritten-fancy { font-family: 'Shadows Into Light', cursive; }
      `}</style>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Back & Download */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <JournalPDFExporter entry={currentJournal} />
        </div>

        {/* Book Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 border-2 border-amber-100">
          <div className="flex-shrink-0">
            <img
              src={bookCoverUrl}
              alt={bookTitle}
              className="w-40 h-56 object-cover rounded-xl shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate(`/book/${encodeURIComponent(bookKey)}`)}
            />
          </div>

          <div className="flex flex-col justify-between flex-1">
            <div>
              <h1
                className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-amber-600 transition-colors"
                onClick={() => navigate(`/book/${encodeURIComponent(bookKey)}`)}
              >
                {bookTitle}
              </h1>
              <p className="text-gray-600 text-lg mt-1">by {bookAuthor}</p>

              <div className="flex items-center mt-3 space-x-3 flex-wrap gap-2">
                <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                  {mood || "Neutral"}
                </span>
                <span className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  {isPrivate ? (
                    <>
                      <Lock size={14} className="mr-1" /> Private
                    </>
                  ) : (
                    <>
                      <Globe size={14} className="mr-1" /> Public
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i <= (rating || 0)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <div className="text-sm mt-2 text-gray-600 font-medium">
                Reading Progress: {readingProgress ?? 0}%
              </div>
              <div className="text-xs mt-1 text-gray-500">
                Created:{" "}
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="mt-8 bg-yellow-100 rounded-lg p-5 shadow-md border-l-4 border-yellow-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="handwritten-title text-lg text-gray-800">
                Journal by
              </p>
              {loadingAuthor ? (
                <p className="handwritten-text text-xl text-gray-500 italic">
                  Loading...
                </p>
              ) : (
                <p className="handwritten-text text-xl text-gray-900 font-semibold">
                  {userName || "Unknown User"}
                </p>
              )}
            </div>
            <button className="px-4 py-2 bg-amber-400 rounded-lg hover:bg-amber-500 text-gray-900 text-sm font-medium shadow-md transition-colors">
              View Profile
            </button>
          </div>
        </div>

        {/* Prompts */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {promptResponses?.summary && (
            <div className="bg-pink-50 p-6 rounded-xl shadow-lg transform rotate-[0.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 border-2 border-pink-100">
              <h2 className="handwritten-title text-xl text-pink-900 mb-3 pb-2 border-b-2 border-pink-200">
                📝 One-Sentence Summary
              </h2>
              <p className="handwritten-text text-base text-gray-800 leading-relaxed">
                {promptResponses.summary}
              </p>
            </div>
          )}

          {promptResponses?.character && (
            <div className="bg-blue-50 p-6 rounded-xl shadow-lg transform rotate-[-0.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 border-2 border-blue-100">
              <h2 className="handwritten-title text-xl text-blue-900 mb-3 pb-2 border-b-2 border-blue-200">
                👤 Character You Relate To
              </h2>
              <p className="handwritten-text text-base text-gray-800 leading-relaxed">
                {promptResponses.character}
              </p>
            </div>
          )}

          {promptResponses?.change && (
            <div className="bg-green-50 p-6 rounded-xl shadow-lg transform rotate-[0.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 border-2 border-green-100 md:col-span-2">
              <h2 className="handwritten-title text-xl text-green-900 mb-3 pb-2 border-b-2 border-green-200">
                ✨ What Would You Change?
              </h2>
              <p className="handwritten-text text-base text-gray-800 leading-relaxed">
                {promptResponses.change}
              </p>
            </div>
          )}
        </div>

        {/* Main Journal Entry */}
        <div className="mt-10 bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-2xl transform hover:scale-[1.01] transition-transform duration-300 border-4 border-amber-200">
          <h2 className="handwritten-fancy text-3xl text-amber-900 mb-6 pb-3 border-b-4 border-amber-300">
            💭 Your Thoughts
          </h2>
          <div className="bg-white bg-opacity-60 p-6 rounded-xl">
            <p className="handwritten-text text-lg text-gray-800 leading-loose whitespace-pre-line">
              {entry}
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="handwritten-fancy text-4xl text-amber-400 opacity-50">
              ~
            </div>
          </div>
        </div>

        {/* Votes */}
        <div className="flex justify-between items-center mt-10">
          <div className="flex space-x-4">
            <button
              onClick={handleUpvote}
              disabled={loading}
              className={`flex items-center px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                hasUpvoted
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              <ThumbsUp
                size={18}
                className={`mr-1 ${hasUpvoted ? "fill-white" : ""}`}
              />
              {upvotedBy.length}
            </button>
            <button
              onClick={handleDownvote}
              disabled={loading}
              className={`flex items-center px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                hasDownvoted
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              <ThumbsDown
                size={18}
                className={`mr-1 ${hasDownvoted ? "fill-white" : ""}`}
              />
              {downvotedBy.length}
            </button>
          </div>

          {currentJournal.userId === currentUser?.uid && (
            <div className="flex space-x-4">
              <button className="px-6 py-3 bg-amber-200 text-gray-800 rounded-xl hover:bg-amber-300 font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                Edit
              </button>
              <button className="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
