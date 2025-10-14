import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";
import { setUser, setLoading } from "./store/slices/authSlice"; // Adjust path as needed

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home/Home";
import MyBooks from "./pages/MyBooks/MyBooks";
import SearchResults from "./pages/searchResults/SearchResults";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import ViewEntries from "./pages/viewEntries";
import Followers from "./pages/Followers/Followers";
import Followings from "./pages/Followings/Followings";
import BookDetails from "./pages/BookDetails/BookDetails";
import AllJournalsFeed from "./pages/AllJournalsFeed/AllJournalsFeed";
import AddJournalEntry from "./pages/AddJournalEntry/AddJournalEntry";
import JournalDetail from "./pages/JournalDetail/JournalDetail";
import UserSearchResult from "./pages/UserSearchResult/UserSearchResult";
import GenreBooks from "./pages/GenreBooks/GenreBooks";
import EditProfile from "./pages/EditProfile/EditProfile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const hideNavbarPaths = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  // Critical: Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - sync to Redux
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          })
        );
      } else {
        // User is signed out - clear Redux state
        dispatch(setUser(null));
      }
      // Auth state is now loaded
      dispatch(setLoading(false));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            }
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
            path="/profile/:user"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followers"
            element={
              <ProtectedRoute>
                <Followers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followings"
            element={
              <ProtectedRoute>
                <Followings />
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
          <Route path="/journal/:entryId" element={<JournalDetail />} />
          <Route path="/view-entries" element={<ViewEntries />} />
          <Route path="/users/:query" element={<UserSearchResult />} />
          <Route path="/genre/:genreName" element={<GenreBooks />} />
        </Routes>
      </main>

      {!shouldHideNavbar && <Footer />}
    </div>
  );
}

export default App;
