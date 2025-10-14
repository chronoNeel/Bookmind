import React from "react";
import {
  Heart,
  Smile,
  Zap,
  Coffee,
  Cloud,
  Meh,
  Frown,
  Angry,
} from "lucide-react";

const moods = [
  { icon: Heart, label: "Loved", color: "text-red-600", bg: "bg-red-100" },
  { icon: Smile, label: "Happy", color: "text-green-600", bg: "bg-green-100" },
  {
    icon: Zap,
    label: "Excited",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  { icon: Coffee, label: "Cozy", color: "text-amber-700", bg: "bg-amber-100" },
  {
    icon: Cloud,
    label: "Melancholy",
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  { icon: Meh, label: "Neutral", color: "text-gray-600", bg: "bg-gray-100" },
  { icon: Frown, label: "Sad", color: "text-blue-700", bg: "bg-blue-100" },
  { icon: Angry, label: "Frustrated", color: "text-red-700", bg: "bg-red-100" },
];

interface MoodRatingProps {
  mood: string;
  rating?: number;
}

const MoodRating: React.FC<MoodRatingProps> = ({ mood, rating }) => {
  const getMoodConfig = (mood: string) => {
    return (
      moods.find((m) => m.label.toLowerCase() === mood.toLowerCase()) ||
      moods[5]
    );
  };

  const renderStars = (rating: number | undefined) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-amber-500 fill-current" : "text-amber-200"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-amber-700 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const moodConfig = getMoodConfig(mood);
  const MoodIcon = moodConfig.icon;

  return (
    <div className="flex items-center justify-between mb-4">
      <div
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${moodConfig.bg}`}
      >
        <MoodIcon className={`w-5 h-5 ${moodConfig.color}`} />
        <span className={`text-sm font-semibold ${moodConfig.color}`}>
          {mood}
        </span>
      </div>
      {renderStars(rating)}
    </div>
  );
};

export default MoodRating;
