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
  </div>
);

export default JournalHeader;
