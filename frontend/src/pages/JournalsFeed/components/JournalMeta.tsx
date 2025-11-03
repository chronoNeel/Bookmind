import { Globe, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JournalMetaProps {
  authorFullName: string;
  authorUserName: string;
  authorProfilePic?: string;
  createdAt: string;
  isPrivate: boolean;
}

const JournalMeta = ({
  authorFullName,
  authorUserName,
  authorProfilePic,
  createdAt,
  isPrivate,
}: JournalMetaProps) => {
  const navigate = useNavigate();

  const privacyIcon = isPrivate ? (
    <Lock className="h-4 w-4" />
  ) : (
    <Globe className="h-4 w-4" />
  );

  return (
    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-600">
      <span className="inline-flex items-center gap-2">
        {authorProfilePic ? (
          <img
            src={authorProfilePic}
            alt={`${authorFullName || "User"}'s profile`}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
            loading="lazy"
            width={28}
            height={28}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500 ring-1 ring-slate-200">
            ?
          </div>
        )}

        <span
          className="font-medium text-slate-800 cursor-pointer hover:text-slate-900 underline-offset-4 hover:underline"
          onClick={() => navigate(`/profile/${authorUserName}`)}
        >
          {authorFullName || "Unknown User"}
        </span>
      </span>

      <span>• {new Date(createdAt).toLocaleDateString()}</span>

      <span className="inline-flex items-center gap-1">
        {privacyIcon} {isPrivate ? "Private" : "Public"}
      </span>
    </div>
  );
};

export default JournalMeta;
