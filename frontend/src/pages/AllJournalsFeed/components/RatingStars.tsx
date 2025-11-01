import { Star } from "lucide-react";

export default function RatingStars({ value = 0 }: { value?: number }) {
  const stars = Array.from({ length: 5 });
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating ${value} of 5`}
    >
      {stars.map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < value ? "fill-yellow-400 stroke-yellow-400" : "stroke-slate-300"
          }`}
        />
      ))}
    </div>
  );
}
