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
import Mood from "@models/Mood";

interface MoodSelectorProps {
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  setSelectedMood,
}) => {
  const moods: Mood[] = [
    { icon: Heart, label: "Loved", color: "text-red-500", bg: "bg-red-50" },
    { icon: Smile, label: "Happy", color: "text-green-500", bg: "bg-green-50" },
    {
      icon: Zap,
      label: "Excited",
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    { icon: Coffee, label: "Cozy", color: "text-amber-600", bg: "bg-amber-50" },
    {
      icon: Cloud,
      label: "Melancholy",
      color: "text-blue-400",
      bg: "bg-blue-50",
    },
    { icon: Meh, label: "Neutral", color: "text-gray-500", bg: "bg-gray-50" },
    { icon: Frown, label: "Sad", color: "text-blue-600", bg: "bg-blue-50" },
    {
      icon: Angry,
      label: "Frustrated",
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="mb-5">
      <label
        className="d-block fw-semibold mb-3 fs-5"
        style={{ color: "#5a4a3a" }}
      >
        How did this book make you feel?
      </label>
      <div className="row g-2">
        {moods.map((mood) => {
          const MoodIcon = mood.icon;
          const isSelected = selectedMood === mood.label;
          return (
            <div key={mood.label} className="col-4 col-sm-3 col-lg-2">
              <button
                onClick={() => setSelectedMood(isSelected ? "" : mood.label)}
                className={`w-100 d-flex flex-column align-items-center gap-2 p-3 rounded-3 border-2 transition-all ${
                  isSelected
                    ? "border-amber-400 shadow-sm"
                    : "border-amber-100 hover-border-amber-200"
                }`}
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #fef3e2 0%, #fde68a 100%)"
                    : "rgba(255, 255, 255, 0.7)",
                  transition: "all 0.2s ease",
                }}
              >
                <MoodIcon
                  className={`${mood.color} ${
                    isSelected ? "animate-pulse" : ""
                  }`}
                  size={20}
                />
                <span className="small fw-medium" style={{ color: "#5a4a3a" }}>
                  {mood.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      {selectedMood && (
        <p className="text-muted small mt-3 mb-0">
          Feeling:{" "}
          <span className="fw-semibold" style={{ color: "#92400e" }}>
            {selectedMood}
          </span>
        </p>
      )}
    </div>
  );
};

export default MoodSelector;
