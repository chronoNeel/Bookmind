import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  hoverRating: number;
  setRating: (val: number) => void;
  setHoverRating: (val: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  hoverRating,
  setRating,
  setHoverRating,
}) => {
  return (
    <div className="mb-8">
      <label className="block text-lg font-semibold text-gray-900 mb-4">
        Rate this book
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              className={`w-10 h-10 ${
                star <= (hoverRating || rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 hover:text-amber-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-4 text-gray-900 opacity-70 self-center">
          {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "No rating"}
        </span>
      </div>
    </div>
  );
};

export default StarRating;
