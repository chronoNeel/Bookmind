import React from "react";

export const JournalContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800 p-6 md:p-10 relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-30 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    ></div>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&family=Patrick+Hand&family=Shadows+Into+Light&display=swap');
      .handwritten-title { font-family: 'Indie Flower', cursive; }
      .handwritten-text { font-family: 'Patrick Hand', cursive; }
      .handwritten-fancy { font-family: 'Shadows Into Light', cursive; }
    `}</style>
    <div className="relative z-10 max-w-5xl mx-auto">{children}</div>
  </div>
);
