import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SimilarBook } from "@models/Book";

interface SimilarBooksCarouselProps {
  similarBooks: SimilarBook[];
  onBookClick: (workKey: string) => void;
}

const SimilarBooksCarousel: React.FC<SimilarBooksCarouselProps> = ({
  similarBooks,
  onBookClick,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => Math.min(similarBooks.length - 3, prev + 1));
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        ✨ Similar Books
      </h2>
      <div className="relative bg-white rounded-3xl shadow-md p-8 overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${carouselIndex * 220}px)` }}
        >
          {similarBooks.map((similarBook, idx) => (
            <div
              key={`${similarBook.workKey}-${idx}`}
              className="flex-shrink-0 w-48 cursor-pointer group"
              onClick={() => onBookClick(similarBook.workKey)}
            >
              {similarBook.coverUrl ? (
                <img
                  src={similarBook.coverUrl}
                  alt={similarBook.title}
                  className="w-full h-72 object-cover rounded-xl shadow-md group-hover:scale-105 transition-all"
                />
              ) : (
                <div className="w-full h-72 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">
                {similarBook.title}
              </h3>
              <p className="text-sm text-gray-600">{similarBook.author}</p>
            </div>
          ))}
        </div>

        {carouselIndex > 0 && (
          <button
            onClick={handlePrevCarousel}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-amber-50 transition-colors"
          >
            <ChevronLeft size={24} className="text-amber-700" />
          </button>
        )}
        {carouselIndex < similarBooks.length - 3 && (
          <button
            onClick={handleNextCarousel}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-amber-50 transition-colors"
          >
            <ChevronRight size={24} className="text-amber-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SimilarBooksCarousel;
