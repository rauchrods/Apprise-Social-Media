import "./App.scss";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/signup/SignUpPage";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/sideBar/SideBar";
import RightPanel from "./components/rightPanel/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/loadingSpinner/LoadingSpinner";
import SearchUsersPage from "./pages/searchUsers/SearchUsersPage";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/features/authSlice";
import SuggestedUsers from "./pages/SuggestedUsers/SuggestedUsers";

function App() {
  const dispatch = useDispatch();
  const {
    data: authUser,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data?.error) {
          return null;
        }
        // console.log("Auth User: ", data);
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }
        dispatch(setUser(data));
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      console.log("Auth User on success: ", data);
      dispatch(setUser(data));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // retry: false,
  });

  // console.log("data:authUser ", authUser);

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  // Protected Route Component
  const ProtectedRoute = React.memo(({ children, authUser }) => {
    return authUser ? children : <Navigate to="/login" replace />;
  });

  // Public Route Component (for login/signup)
  const PublicRoute = React.memo(({ children, authUser }) => {
    return !authUser ? children : <Navigate to="/" replace />;
  });

  return (
    <div className="app-container">
      {authUser && <Sidebar />}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute authUser={authUser}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute authUser={authUser}>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userName"
          element={
            <ProtectedRoute authUser={authUser}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute authUser={authUser}>
              <SearchUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggested/users"
          element={
            <ProtectedRoute authUser={authUser}>
              <SuggestedUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute authUser={authUser}>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute authUser={authUser}>
              <SignUpPage />
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
