import React, { useState } from "react";
import { CheckCircle, Eye, BookOpen } from "lucide-react";
import { Shelf } from "./components/Shelf";
import { ExpandedShelfState } from "./components/types";
import { useAppSelector } from "../../hooks/redux";

const MyBooks: React.FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const shelves = useAppSelector((state) => state.auth.user?.shelves);
  const { completed = [], ongoing = [], wantToRead = [] } = shelves || {};

  const [expandedShelf, setExpandedShelf] = useState<ExpandedShelfState>({
    completed: false,
    ongoing: false,
    wantToRead: false,
  });

  const toggleShelf = (shelfName: keyof ExpandedShelfState) => {
    setExpandedShelf((prev) => ({
      ...prev,
      [shelfName]: !prev[shelfName],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="relative p-4 md:p-8">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full border-4 border-amber-200 shadow-sm w-20 h-20 bg-amber-300 flex items-center justify-center overflow-hidden">
                <img
                  src={currentUser?.profilePic}
                  alt={currentUser?.fullName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Shelves</h1>
          </div>
          <div className="space-y-6">
            <Shelf
              title="Completed"
              shelfBooks={completed}
              icon={CheckCircle}
              color="bg-green-500"
              shelfKey="completed"
              isExpanded={expandedShelf.completed}
              onToggle={() => toggleShelf("completed")}
            />
            <Shelf
              title="Currently Reading"
              shelfBooks={ongoing}
              icon={Eye}
              color="bg-blue-500"
              shelfKey="ongoing"
              isExpanded={expandedShelf.ongoing}
              onToggle={() => toggleShelf("ongoing")}
            />
            <Shelf
              title="Want to Read"
              shelfBooks={wantToRead}
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
};

export default MyBooks;
