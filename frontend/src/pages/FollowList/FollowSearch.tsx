import React from "react";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  type: "followers" | "following";
}

const FollowSearch: React.FC<Props> = ({ value, onChange, type }) => (
  <div className="mb-8">
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={`Search ${type}...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
      />
    </div>
  </div>
);

export default FollowSearch;
