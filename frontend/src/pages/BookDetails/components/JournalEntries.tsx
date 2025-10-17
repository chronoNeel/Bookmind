import React from "react";
import JournalEntryCard from "./JournalEntryCard";
import { JournalEntry } from "../../../types/Book";

interface JournalEntriesProps {
  entries: JournalEntry[];
}

const JournalEntries: React.FC<JournalEntriesProps> = ({ entries }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        📝 Journal Entries
      </h2>
      <div className="space-y-6">
        {entries.map((entry) => (
          <JournalEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default JournalEntries;
