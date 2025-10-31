import React from "react";

interface PromptResponses {
  summary?: string;
  character?: string;
  change?: string;
}

interface Props {
  promptResponses?: PromptResponses;
}

export const JournalPrompts: React.FC<Props> = ({ promptResponses }) => {
  if (!promptResponses) return null;

  return (
    <div className="mt-10 grid md:grid-cols-2 gap-6">
      {promptResponses.summary && (
        <div className="bg-pink-50 p-6 rounded-xl shadow-lg transform rotate-[0.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 border-2 border-pink-100">
          <h2 className="handwritten-title text-xl text-pink-900 mb-3 pb-2 border-b-2 border-pink-200">
            📝 Summary
          </h2>
          <p className="handwritten-text text-base text-gray-800 leading-relaxed">
            {promptResponses.summary}
          </p>
        </div>
      )}

      {promptResponses.character && (
        <div className="bg-blue-50 p-6 rounded-xl shadow-lg transform rotate-[-0.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 border-2 border-blue-100">
          <h2 className="handwritten-title text-xl text-blue-900 mb-3 pb-2 border-b-2 border-blue-200">
            👤 Relatable Character
          </h2>
          <p className="handwritten-text text-base text-gray-800 leading-relaxed">
            {promptResponses.character}
          </p>
        </div>
      )}

      {promptResponses.change && (
        <div className="bg-green-50 p-6 rounded-xl shadow-lg transform rotate-[0.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 border-2 border-green-100 md:col-span-2">
          <h2 className="handwritten-title text-xl text-green-900 mb-3 pb-2 border-b-2 border-green-200">
            ✨ Suggested Change
          </h2>
          <p className="handwritten-text text-base text-gray-800 leading-relaxed">
            {promptResponses.change}
          </p>
        </div>
      )}
    </div>
  );
};
