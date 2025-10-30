import React from "react";

interface Props {
  entry?: string;
}

export const JournalEntry: React.FC<Props> = ({ entry }) => {
  if (!entry) return null;

  return (
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
  );
};
