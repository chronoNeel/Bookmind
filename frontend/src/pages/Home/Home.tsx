import React, { useCallback, useMemo } from "react";
import ReadingChallenge from "./components/ReadingChallenge";
import UserStats from "./components/UserStats";
import MotivationalQuote from "./components/MotivationalQuote";
import TrendingBooks from "./components/TrendingBooks";
import FriendsActivity from "./components/FriendsActivity";
import PopularGenres from "./components/PopularGenres";
import DailyTip from "./components/DailyTip";
import SearchBar from "@components/SearchBar";
import UserSearch from "./components/UserSearch";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { searchUsers } from "@store/slices/searchSlice";
import { RootState } from "@store";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.user);
  const { userSearchResults, isLoadingUsers } = useAppSelector(
    (state: RootState) => state.search
  );

  const {
    completed = [],
    wantToRead = [],
    ongoing = [],
  } = currentUser?.shelves || {};

  const completedCount = completed.length;
  const wantToReadCount = wantToRead.length;
  const ongoingCount = ongoing.length;
  const userStats = { wantToReadCount, ongoingCount, completedCount };

  // Memoize static data
  const friendsActivity = useMemo(
    () => [
      { name: "Shohan", action: "rated", book: "Atomic Habits", rating: 4 },
      {
        name: "Lincoln",
        action: "added",
        book: "The Alchemist",
        shelf: "Want to Read",
      },
      { name: "Nabil", action: "finished", book: "Dune", rating: 5 },
      {
        name: "Fatima",
        action: "started",
        book: "1984",
        shelf: "Currently Reading",
      },
    ],
    []
  );

  const trendingGenres = useMemo(
    () => [
      "Fantasy",
      "Self-Help",
      "Sci-Fi",
      "Romance",
      "Mystery",
      "Biography",
      "Philosophy",
      "History",
    ],
    []
  );

  const readingQuotes = useMemo(
    () => [
      "A reader lives a thousand lives before he dies. – George R.R. Martin",
      "The more that you read, the more things you will know. – Dr. Seuss",
      "Books are a uniquely portable magic. – Stephen King",
      "Reading is to the mind what exercise is to the body. – Joseph Addison",
      "A room without books is like a body without a soul. – Cicero",
    ],
    []
  );

  const dailyTip = useMemo(
    () =>
      "Try reading for just 15 minutes before bed — it helps you unwind and improves sleep quality!",
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      if (!query) return;
      dispatch(searchUsers(query));
    },
    [dispatch]
  );

  const handleSearchSumbit = (query: string) => {
    navigate(`users/${encodeURIComponent(query)}`, {
      state: { userSearchResults },
    });
  };

  return (
    <div
      className="min-vh-100 position-relative overflow-hidden text-dark p-3 p-md-4"
      style={{
        background: "linear-gradient(135deg, #fffaea 50%)",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          pointerEvents: "none",
          opacity: 0.3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      <SearchBar />

      <div
        className="container-fluid py-2 position-relative"
        style={{ zIndex: 1 }}
      >
        <div className="row justify-content-center g-0">
          <div className="col-12 col-xxl-10 col-xl-11">
            <div className="p-3 p-md-4 rounded shadow-s bg-opacity-75">
              <div className="row g-3 g-lg-4">
                {/* Left Sidebar */}
                <div className="col-12 col-lg-3 order-lg-1">
                  <div className="d-flex flex-column gap-3 gap-lg-4">
                    {/* ReadingChallenge now self-contained */}
                    <ReadingChallenge />
                    <UserStats {...userStats} />
                    <MotivationalQuote quote={readingQuotes[0]} />
                    <UserSearch
                      onSearch={handleSearch}
                      onSubmit={handleSearchSumbit}
                      suggestions={userSearchResults.map((u) => u.userName)}
                      isLoadingUser={isLoadingUsers}
                    />
                  </div>
                </div>

                <div className="col-12 col-lg-6 order-lg-2">
                  <TrendingBooks />
                </div>

                <div className="col-12 col-lg-3 order-lg-3">
                  <div className="d-flex flex-column gap-3 gap-lg-4">
                    <FriendsActivity activities={friendsActivity} />
                    <PopularGenres genres={trendingGenres} />
                    <DailyTip tip={dailyTip} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
