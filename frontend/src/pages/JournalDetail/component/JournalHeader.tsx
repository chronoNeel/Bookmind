import React from "react";
import { Star, Lock, Globe } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import JournalPDFExporter from "./JournalPdfExporter";
import { Journal } from "@models/journal";

interface Props {
  journal: Journal;
  navigate: NavigateFunction;
}

export const JournalHeader: React.FC<Props> = ({ journal, navigate }) => {
  const {
    bookKey,
    bookTitle,
    bookAuthorList,
    bookCoverUrl,
    rating,
    mood,
    isPrivate,
    readingProgress,
    createdAt,
  } = journal;

  return (
    <>
      <div className="flex justify-end mb-6">
        <JournalPDFExporter entry={journal} />
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 border-2 border-amber-100">
        <div className="flex-shrink-0">
          {bookCoverUrl ? (
            <img
              src={bookCoverUrl}
              alt={bookTitle}
              className="w-40 h-56 object-cover rounded-xl shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate(`/book/${encodeURIComponent(bookKey)}`)}
            />
          ) : (
            <div className="w-40 h-56 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              No cover
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h1
              className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-amber-600 transition-colors"
              onClick={() => navigate(`/book/${encodeURIComponent(bookKey)}`)}
            >
              {bookTitle}
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              by {bookAuthorList.join(", ")}
            </p>
            <div className="flex items-center mt-3 space-x-3 flex-wrap gap-2">
              {mood && (
                <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                  {mood}
                </span>
              )}
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
    </>
  );
};
