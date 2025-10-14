import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Star,
  Lock,
  Globe,
  ArrowLeft,
  Download,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import JournalEntry from "../../types/JournalEntry";
import JournalPDFExporter from "./component/JournalPdfExporter";

const JournalDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const journal: JournalEntry = location.state?.entry;

  const {
    book,
    rating,
    mood,
    entry,
    promptResponses,
    isPrivate,
    readingProgress,
    createdAt,
  } = journal;

  // console.log(book);

  const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleUpvote = () => {
    if (userVote === "up") {
      setUpvotes(upvotes - 1);
      setUserVote(null);
    } else {
      setUpvotes(upvotes + 1);
      if (userVote === "down") {
        setDownvotes(downvotes - 1);
      }
      setUserVote("up");
    }
  };

  const handleDownvote = () => {
    if (userVote === "down") {
      setDownvotes(downvotes - 1);
      setUserVote(null);
    } else {
      setDownvotes(downvotes + 1);
      if (userVote === "up") {
        setUpvotes(upvotes - 1);
      }
      setUserVote("down");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800 p-6 md:p-10 relative overflow-hidden">
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&family=Patrick+Hand&family=Shadows+Into+Light&display=swap');
        
        .handwritten-title {
          font-family: 'Indie Flower', cursive;
        }
        
        .handwritten-text {
          font-family: 'Patrick Hand', cursive;
        }
        
        .handwritten-fancy {
          font-family: 'Shadows Into Light', cursive;
        }
      `}</style>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Back Button & Download */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>

          <JournalPDFExporter entry={journal} />
        </div>

        {/* Header Section - Main Book Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-6 transform hover:scale-[1.01] transition-transform duration-300 border-2 border-amber-100">
          <div className="flex-shrink-0">
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt={book.title}
              className="w-40 h-56 object-cover rounded-xl shadow-lg cursor-pointer"
              onClick={() =>
                navigate(`/book/${encodeURIComponent(book.key)}`, {
                  state: { book },
                })
              }
            />
          </div>

          <div className="flex flex-col justify-between flex-1">
            <div>
              <h1
                className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-amber-600 transition-colors"
                onClick={() =>
                  navigate(`/book/${encodeURIComponent(book.key)}`, {
                    state: { book },
                  })
                }
              >
                {book.title}
              </h1>

              <p className="text-gray-600 text-lg mt-1">
                by {book.author_name?.[0] || "Unknown Author"}
              </p>

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

        {/* Author Info - Sticky Note Style */}
        <div className="mt-8 bg-yellow-100 rounded-lg p-5 shadow-lg transform rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300 border-l-4 border-yellow-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="handwritten-title text-lg text-gray-800">
                Journal by
              </p>
              <p className="handwritten-text text-xl text-gray-900 font-semibold">
                Niloy Roy
              </p>
            </div>
            <button className="px-4 py-2 bg-amber-400 rounded-lg hover:bg-amber-500 text-gray-900 text-sm font-medium shadow-md transition-all hover:shadow-lg">
              View Profile
            </button>
          </div>
        </div>

        {/* Guided Prompts - Sticky Notes Grid */}
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

        {/* Main Journal Entry - Large Journal Page Style */}
        <div className="mt-10 bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-2xl transform hover:scale-[1.01] transition-transform duration-300 border-4 border-amber-200">
          <h2 className="handwritten-fancy text-3xl text-amber-900 mb-6 pb-3 border-b-4 border-amber-300">
            💭 Your Thoughts
          </h2>
          <div className="bg-white bg-opacity-60 p-6 rounded-xl">
            <p className="handwritten-text text-lg text-gray-800 leading-loose whitespace-pre-line">
              {entry}
            </p>
          </div>

          {/* Decorative element */}
          <div className="mt-4 flex justify-end">
            <div className="handwritten-fancy text-4xl text-amber-400 opacity-50">
              ~
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-10">
          <div className="flex space-x-4">
            <button
              onClick={handleUpvote}
              className={`flex items-center px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${
                userVote === "up"
                  ? "bg-green-200 text-green-800"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              <ThumbsUp size={18} className="mr-1" /> {upvotes}
            </button>
            <button
              onClick={handleDownvote}
              className={`flex items-center px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${
                userVote === "down"
                  ? "bg-red-200 text-red-800"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              <ThumbsDown size={18} className="mr-1" /> {downvotes}
            </button>
          </div>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-amber-200 text-gray-800 rounded-xl hover:bg-amber-300 font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105">
              Edit
            </button>
            <button className="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
