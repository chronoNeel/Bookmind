import React from "react";
import { BookOpen } from "lucide-react";
import { EmptyShelfProps } from "./types";

export const EmptyShelf: React.FC<EmptyShelfProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <BookOpen size={48} className="mb-3 opacity-50" />
    <p className="text-sm">{message}</p>
  </div>
);
