import React, { useState, useMemo } from "react";
import { CheckCircle, Eye, BookOpen } from "lucide-react";
import { Shelf } from "./components/Shelf";
import { ShelfState, ExpandedShelfState } from "./components/types";
import { useAppSelector } from "../../hooks/redux";

export default function MyBooks() {
  const { completed, ongoing, wantToRead } = useAppSelector(
    (state) => state.shelf
  );

  // Compute shelves from Redux state - updates when Redux state changes
  const shelves = useMemo<ShelfState>(
    () => ({
      read: completed,
      currentlyReading: ongoing,
      wantToRead: wantToRead,
    }),
    [completed, ongoing, wantToRead]
  );

  const [expandedShelf, setExpandedShelf] = useState<ExpandedShelfState>({
    read: false,
    currentlyReading: false,
    wantToRead: false,
  });

  const totalBooks =
    shelves.read.length +
    shelves.currentlyReading.length +
    shelves.wantToRead.length;

  const toggleShelf = (shelfName: keyof ExpandedShelfState) => {
    setExpandedShelf((prev) => ({
      ...prev,
      [shelfName]: !prev[shelfName],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Main Content with contained paper texture */}
      <div className="relative p-4 md:p-8">
        {/* Paper texture overlay - only for this section */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full border-4 border-amber-200 shadow-sm w-20 h-20 bg-amber-300 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-amber-700" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2">My Books</h1>
            <p className="text-amber-700">
              {totalBooks} books across {Object.keys(shelves).length} shelves
            </p>
          </div>

          {/* Shelves */}
          <div className="space-y-6">
            <Shelf
              title="Read"
              bookKeys={shelves.read}
              icon={CheckCircle}
              color="bg-green-500"
              shelfKey="read"
              isExpanded={expandedShelf.read}
              onToggle={() => toggleShelf("read")}
            />
            <Shelf
              title="Currently Reading"
              bookKeys={shelves.currentlyReading}
              icon={Eye}
              color="bg-blue-500"
              shelfKey="currentlyReading"
              isExpanded={expandedShelf.currentlyReading}
              onToggle={() => toggleShelf("currentlyReading")}
            />
            <Shelf
              title="Want to Read"
              bookKeys={shelves.wantToRead}
              icon={BookOpen}
              color="bg-amber-500"
              shelfKey="wantToRead"
              isExpanded={expandedShelf.wantToRead}
              onToggle={() => toggleShelf("wantToRead")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
