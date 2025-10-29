import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";
import {
  setUser,
  setLoading,
  fetchUserProfile,
} from "./store/slices/authSlice";

import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

import Home from "@pages/Home/Home";
import MyBooks from "@pages/MyBooks/MyBooks";
import SearchResults from "@pages/SearchResults/SearchResults";
import Signup from "@pages/Signup/Signup";
import Login from "@pages/Login/Login";
import Profile from "@pages/Profile/Profile";
import BookDetails from "@pages/BookDetails/BookDetails";
import AllJournalsFeed from "@pages/AllJournalsFeed/AllJournalsFeed";
import AddJournalEntry from "@pages/AddJournalEntry/AddJournalEntry";
import JournalDetail from "@pages/JournalDetail/JournalDetail";
import UserSearchResult from "@pages/UserSearchResult/UserSearchResult";
import GenreBooks from "@pages/GenreBooks/GenreBooks";
import EditProfile from "@pages/EditProfile/EditProfile";

import ProtectedRoute from "@components/ProtectedRoute";
import { useAppDispatch } from "./hooks/redux";
import TextRevealAnimation from "@pages/Login/TextRevealAnimation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FollowList from "@pages/FollowList/FollowList";

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hideNavbarPaths = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  useEffect(() => {
    if (["/login", "/signup"].includes(location.pathname)) {
      dispatch(setLoading(false));
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await dispatch(fetchUserProfile(firebaseUser.uid)).unwrap();
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <ToastContainer position="top-center" autoClose={1500} />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login-success"
            element={<TextRevealAnimation onComplete={() => navigate("/")} />}
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute requireAuth={false}>
                <Signup />
              </ProtectedRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/my-books"
            element={
              <ProtectedRoute>
                <MyBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journals"
            element={
              <ProtectedRoute>
                <AllJournalsFeed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-journal"
            element={
              <ProtectedRoute>
                <AddJournalEntry />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal-edit/:journalId"
            element={
              <ProtectedRoute>
                <AddJournalEntry />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:userName"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:userName/followers"
            element={
              <ProtectedRoute>
                <FollowList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:userName/following"
            element={
              <ProtectedRoute>
                <FollowList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Public / non-protected routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/book/:bookKey" element={<BookDetails />} />
          <Route
            path="/journal-preview/:journalId"
            element={<JournalDetail />}
          />
          <Route path="/users/:query" element={<UserSearchResult />} />
          <Route path="/genre/:genreName" element={<GenreBooks />} />
        </Routes>
      </main>

      {!shouldHideNavbar && <Footer />}
    </div>
  );
}

export default App;
