import "./App.scss";
import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/signup/SignUpPage";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/sideBar/SideBar";
import RightPanel from "./components/rightPanel/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/loadingSpinner/LoadingSpinner";
import SearchUsersPage from "./pages/searchUsers/SearchUsersPage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/features/authSlice";
import SuggestedUsers from "./pages/SuggestedUsers/SuggestedUsers";
import SharablePost from "./pages/post/SharablePost";
import FollowersFollowing from "./pages/followers-following/FollowersFollowing";
import useFetch from "./hooks/useFetch";

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  const {
    data,
    isLoading,
    error,
    refetch: getAuthUser,
  } = useFetch("/api/auth/me", {
    onSuccess: (data) => {
      //console.log("Auth User: ", data);
      if (data && !data.error) {
        dispatch(setUser(data));
        setAuthChecked(true);
      }
    },
    onError: (err) => {
      toast.error(err.message);
      setAuthChecked(true);
    },
  });

  const authUser = useSelector((state) => state.auth.user);

  // console.log("data:authUser ", authUser);

  if (isLoading || !authChecked) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  // Protected Route Component
  const ProtectedRoute = React.memo(({ children }) => {
    return authUser ? children : <Navigate to="/login" replace />;
  });

  // Public Route Component (for login/signup)
  const PublicRoute = React.memo(({ children }) => {
    return !authUser ? children : <Navigate to="/" replace />;
  });

  return (
    <div className="app-container">
      {authUser && <Sidebar />}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userName"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggested/users"
          element={
            <ProtectedRoute>
              <SuggestedUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <SharablePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userName/connections/:type"
          element={
            <ProtectedRoute>
              <FollowersFollowing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage getAuthUser={getAuthUser} />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage getAuthUser={getAuthUser} />
            </PublicRoute>
          }
        />
      </Routes>

      {/* {authUser && <RightPanel />} */}
      <Toaster />
    </div>
  );
}

export default App;
