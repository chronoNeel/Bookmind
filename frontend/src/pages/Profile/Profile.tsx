import React, { useState } from "react";
import {
  BookOpen,
  Book,
  CheckCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Users,
  Edit3,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const [stats] = useState({
    wantToRead: 24,
    currentlyReading: 3,
    read: 87,
    journalEntries: 45,
  });

  const [followers] = useState(342);
  const [following] = useState(189);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useParams();

  const [activeTab, setActiveTab] = useState("overview");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const favoriteBooks = [
    {
      title: "The Power of Darkness",
      author: "Edith Nesbit",
      workKey: "/works/OL407498W",
      coverUrl: "https://covers.openlibrary.org/b/id/882715-M.jpg",
      subject: "Ghosts",
    },
    {
      title: "The Canterville Ghost",
      author: "Oscar Wilde",
      workKey: "/works/OL14877871W",
      coverUrl: "https://covers.openlibrary.org/b/id/6960817-M.jpg",
      subject: "Ghosts",
    },
    {
      title: "The Legend of Sleepy Hollow",
      author: "Washington Irving",
      workKey: "/works/OL63985W",
      coverUrl: "https://covers.openlibrary.org/b/id/8243083-M.jpg",
      subject: "Ghosts",
    },
    {
      title: "The Great God Pan",
      author: "Arthur Machen",
      workKey: "/works/OL3388961W",
      coverUrl: "https://covers.openlibrary.org/b/id/921610-M.jpg",
      subject: "Ghosts",
    },
    {
      title: "Memórias póstumas de Brás Cubas",
      author: "Joaquim Maria Machado de Assis",
      workKey: "/works/OL1003017W",
      coverUrl: "https://covers.openlibrary.org/b/id/123152-M.jpg",
      subject: "Ghosts",
    },
    {
      title: "Frankenstein or The Modern Prometheus",
      author: "Mary Shelley",
      workKey: "/works/OL450063W",
      coverUrl: "https://covers.openlibrary.org/b/id/12356249-M.jpg",
      subject: "Monsters",
    },
    {
      title: "Where the Wild Things Are",
      author: "Maurice Sendak",
      workKey: "/works/OL2568879W",
      coverUrl: "https://covers.openlibrary.org/b/id/50842-M.jpg",
      subject: "Monsters",
    },
    {
      title: "The Gruffalo",
      author: "Julia Donaldson",
      workKey: "/works/OL1938178W",
      coverUrl: "https://covers.openlibrary.org/b/id/8561698-M.jpg",
      subject: "Monsters",
    },
    {
      title: "Dracula",
      author: "Bram Stoker",
      workKey: "/works/OL85892W",
      coverUrl: "https://covers.openlibrary.org/b/id/12216503-M.jpg",
      subject: "Monsters",
    },
    {
      title: "The Strange Case of Dr. Jekyll and Mr. Hyde",
      author: "Robert Louis Stevenson",
      workKey: "/works/OL24156W",
      coverUrl: "https://covers.openlibrary.org/b/id/295773-M.jpg",
      subject: "Monsters",
    },
    {
      title: "Carmilla",
      author: "Sheridan Le Fanu",
      workKey: "/works/OL2895536W",
      coverUrl: "https://covers.openlibrary.org/b/id/973851-M.jpg",
      subject: "Vampires",
    },
    {
      title: "'Salem's Lot",
      author: "Stephen King",
      workKey: "/works/OL81632W",
      coverUrl: "https://covers.openlibrary.org/b/id/14654118-M.jpg",
      subject: "Vampires",
    },
    {
      title: "Dracula",
      author: "Bram Stoker",
      workKey: "/works/OL85892W",
      coverUrl: "https://covers.openlibrary.org/b/id/12216503-M.jpg",
      subject: "Vampires",
    },
    {
      title: "The Castle of Otranto",
      author: "Horace Walpole",
      workKey: "/works/OL183675W",
      coverUrl: "https://covers.openlibrary.org/b/id/6468730-M.jpg",
      subject: "Vampires",
    },
    {
      title: "Twilight",
      author: "Stephenie Meyer",
      workKey: "/works/OL5720023W",
      coverUrl: "https://covers.openlibrary.org/b/id/12641977-M.jpg",
      subject: "Vampires",
    },
  ];

  const total = stats.wantToRead + stats.currentlyReading + stats.read;
  const wantPercent = (stats.wantToRead / total) * 100;
  const readingPercent = (stats.currentlyReading / total) * 100;
  const readPercent = (stats.read / total) * 100;
  const navigate = useNavigate();

  const itemsPerPage = 5;
  const maxIndex = Math.max(0, favoriteBooks.length - itemsPerPage);

  const nextSlide = () => {
    setCarouselIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleFollowersClick = () => {
    navigate(`/followers`, {
      state: { user },
    });
    // Navigate to followers list
  };

  const handleFollowingClick = () => {
    navigate(`/followings`, {
      state: { user },
    });
    // Navigate to following list
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    navigate("/edit-profile");
  };

  const handleJournalEntriesClick = () => {
    console.log("Journal entries clicked");
    // Navigate to journal entries
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-40 right-1/3 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Decorative pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Card with Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden mb-8">
          <div className="px-6 sm:px-8 lg:px-12 py-8">
            {/* Profile section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar with human image */}
              <div className="relative group">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 shadow-2xl overflow-hidden">
                  <img
                    src="https://randomuser.me/api/portraits/men/14.jpg"
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* User info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                        {user}
                      </h1>
                      <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Pro Reader
                      </div>
                    </div>

                    {/* Followers/Following */}
                    <div className="flex items-center justify-center sm:justify-start gap-6 mb-3">
                      <button
                        onClick={handleFollowersClick}
                        className="flex items-center gap-2 hover:text-amber-600 transition-colors group"
                      >
                        <Users
                          size={18}
                          className="text-gray-500 group-hover:text-amber-600"
                        />
                        <span className="font-semibold text-gray-800">
                          {followers}
                        </span>
                        <span className="text-gray-600 text-sm">Followers</span>
                      </button>
                      <button
                        onClick={handleFollowingClick}
                        className="flex items-center gap-2 hover:text-amber-600 transition-colors group"
                      >
                        <Users
                          size={18}
                          className="text-gray-500 group-hover:text-amber-600"
                        />
                        <span className="font-semibold text-gray-800">
                          {following}
                        </span>
                        <span className="text-gray-600 text-sm">Following</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl bg-white text-gray-700 border border-amber-200 hover:border-amber-300 hover:bg-amber-50"
                    >
                      <Edit3 size={20} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${
                        isFollowing
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                      }`}
                    >
                      <UserPlus size={20} />
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 max-w-2xl mb-4 leading-relaxed">
                  Avid reader | Fiction enthusiast | Always hunting for the next
                  great story to get lost in. Currently exploring magical
                  realism and contemporary fantasy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Want to Read Card */}
          <button
            onClick={() => setActiveTab("want")}
            className="group backdrop-blur-xl bg-white/80 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-200/50 hover:border-blue-300 hover:-translate-y-1 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Book size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">
                    {stats.wantToRead}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Want to Read
              </h3>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                  style={{ width: `${wantPercent}%` }}
                />
              </div>
            </div>
          </button>

          {/* Currently Reading Card */}
          <button
            onClick={() => setActiveTab("reading")}
            className="group backdrop-blur-xl bg-white/80 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-amber-200/50 hover:border-amber-300 hover:-translate-y-1 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BookOpen
                    size={28}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-amber-600">
                    {stats.currentlyReading}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Currently Reading
              </h3>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse"
                  style={{ width: `${readingPercent}%` }}
                />
              </div>
            </div>
          </button>

          {/* Read Card */}
          <button
            onClick={() => setActiveTab("read")}
            className="group backdrop-blur-xl bg-white/80 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-200/50 hover:border-green-300 hover:-translate-y-1 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle
                    size={28}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">
                    {stats.read}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Books Read
              </h3>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  style={{ width: `${readPercent}%` }}
                />
              </div>
            </div>
          </button>
        </div>

        {/* Favorite Books Carousel */}
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Favorite Books</h2>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={carouselIndex === 0}
                className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <ChevronLeft
                  size={20}
                  className={
                    carouselIndex === 0 ? "text-gray-400" : "text-amber-700"
                  }
                />
              </button>
              <button
                onClick={nextSlide}
                disabled={carouselIndex >= maxIndex}
                className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <ChevronRight
                  size={20}
                  className={
                    carouselIndex >= maxIndex
                      ? "text-gray-400"
                      : "text-amber-700"
                  }
                />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  carouselIndex * (100 / itemsPerPage)
                }%)`,
              }}
            >
              {favoriteBooks.map((book, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 group cursor-pointer"
                  style={{ width: `calc(${100 / itemsPerPage}% - 12.8px)` }}
                >
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/50 hover:border-amber-300 hover:shadow-lg transition-all h-full">
                    <div className="aspect-[2/3] mb-3 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-amber-700 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      {book.subject}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCarouselIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === carouselIndex
                    ? "w-8 bg-amber-500"
                    : "w-2 bg-amber-200 hover:bg-amber-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Analytics Card */}
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Reading Statistics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <svg
                  width="280"
                  height="280"
                  viewBox="0 0 280 280"
                  className="drop-shadow-xl"
                >
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient
                      id="blueGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
                      />
                    </linearGradient>
                    <linearGradient
                      id="yellowGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#fbbf24", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#f97316", stopOpacity: 1 }}
                      />
                    </linearGradient>
                    <linearGradient
                      id="greenGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#4ade80", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#10b981", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>

                  {/* Want to Read */}
                  <path
                    d={`M 140 140 L 140 30 A 110 110 0 ${
                      wantPercent > 50 ? 1 : 0
                    } 1 ${
                      140 + 110 * Math.sin((wantPercent / 100) * 2 * Math.PI)
                    } ${
                      140 - 110 * Math.cos((wantPercent / 100) * 2 * Math.PI)
                    } Z`}
                    fill="url(#blueGrad)"
                    stroke="white"
                    strokeWidth="3"
                    filter="url(#glow)"
                    className="transition-all duration-300 hover:opacity-80"
                  />

                  {/* Currently Reading */}
                  <path
                    d={`M 140 140 L ${
                      140 + 110 * Math.sin((wantPercent / 100) * 2 * Math.PI)
                    } ${
                      140 - 110 * Math.cos((wantPercent / 100) * 2 * Math.PI)
                    } A 110 110 0 ${readingPercent > 50 ? 1 : 0} 1 ${
                      140 +
                      110 *
                        Math.sin(
                          ((wantPercent + readingPercent) / 100) * 2 * Math.PI
                        )
                    } ${
                      140 -
                      110 *
                        Math.cos(
                          ((wantPercent + readingPercent) / 100) * 2 * Math.PI
                        )
                    } Z`}
                    fill="url(#yellowGrad)"
                    stroke="white"
                    strokeWidth="3"
                    filter="url(#glow)"
                    className="transition-all duration-300 hover:opacity-80"
                  />

                  {/* Read */}
                  <path
                    d={`M 140 140 L ${
                      140 +
                      110 *
                        Math.sin(
                          ((wantPercent + readingPercent) / 100) * 2 * Math.PI
                        )
                    } ${
                      140 -
                      110 *
                        Math.cos(
                          ((wantPercent + readingPercent) / 100) * 2 * Math.PI
                        )
                    } A 110 110 0 ${readPercent > 50 ? 1 : 0} 1 140 30 Z`}
                    fill="url(#greenGrad)"
                    stroke="white"
                    strokeWidth="3"
                    filter="url(#glow)"
                    className="transition-all duration-300 hover:opacity-80"
                  />

                  {/* Center circle */}
                  <circle
                    cx="140"
                    cy="140"
                    r="65"
                    fill="white"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <text
                    x="140"
                    y="135"
                    textAnchor="middle"
                    className="text-5xl font-bold fill-gray-800"
                  >
                    {total}
                  </text>
                  <text
                    x="140"
                    y="155"
                    textAnchor="middle"
                    className="text-sm fill-gray-500"
                  >
                    Total Books
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-500" />
                    <span className="font-medium text-gray-700">
                      Want to Read
                    </span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {wantPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-400" />
                    <span className="font-medium text-gray-700">
                      Currently Reading
                    </span>
                  </div>
                  <span className="font-bold text-amber-600">
                    {readingPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
                    <span className="font-medium text-gray-700">
                      Books Read
                    </span>
                  </div>
                  <span className="font-bold text-green-600">
                    {readPercent.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="flex flex-col justify-center gap-4">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">
                    Average Rating
                  </span>
                  <span className="text-3xl">⭐</span>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  4.2 / 5.0
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Based on 87 ratings
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">This Year</span>
                  <span className="text-3xl">📚</span>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  32 Books
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  68% ahead of your goal!
                </p>
              </div>

              {/* Journal Entries Card */}
              <button
                onClick={handleJournalEntriesClick}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300 hover:shadow-lg transition-all group text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">
                    Journal Entries
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FileText size={24} className="text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stats.journalEntries}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Click to view entries
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
