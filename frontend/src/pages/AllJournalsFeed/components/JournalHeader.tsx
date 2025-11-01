import { MoreHorizontal } from "lucide-react";

interface JournalHeaderProps {
  title: string;
  authors: string[];
}

const JournalHeader = ({ title, authors }: JournalHeaderProps) => (
  <div className="flex items-start justify-between gap-3">
    <div>
      <h3 className="text-xl font-serif leading-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-0.5 text-sm text-slate-600">{authors.join(", ")}</p>
    </div>
    <button
      className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
      aria-label="More options"
    >
      <MoreHorizontal className="h-5 w-5" />
    </button>
  </div>
);

export default JournalHeader;
