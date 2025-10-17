// StatsGrid.tsx
import React from "react";
import { Book, BookOpen, CheckCircle } from "lucide-react";

interface StatsGridProps {
  stats: {
    wantToRead: number;
    currentlyReading: number;
    read: number;
    journalEntries: number;
  };
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const total = stats.wantToRead + stats.currentlyReading + stats.read;
  const wantPercent = total > 0 ? (stats.wantToRead / total) * 100 : 0;
  const readingPercent = total > 0 ? (stats.currentlyReading / total) * 100 : 0;
  const readPercent = total > 0 ? (stats.read / total) * 100 : 0;

  const cards = [
    {
      title: "Want to Read",
      value: stats.wantToRead,
      gradient: "from-blue-400 to-blue-500",
      percent: wantPercent,
      icon: <Book size={28} className="text-white" />,
    },
    {
      title: "Currently Reading",
      value: stats.currentlyReading,
      gradient: "from-amber-400 to-orange-400",
      percent: readingPercent,
      icon: <BookOpen size={28} className="text-white" />,
    },
    {
      title: "Books Read",
      value: stats.read,
      gradient: "from-green-400 to-emerald-500",
      percent: readPercent,
      icon: <CheckCircle size={28} className="text-white" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border hover:shadow-2xl transition-all"
        >
          <div className="flex justify-between items-center mb-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${card.gradient}`}
            >
              {card.icon}
            </div>
            <div className="text-4xl font-bold text-gray-700">{card.value}</div>
          </div>
          <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${card.gradient}`}
              style={{ width: `${card.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
