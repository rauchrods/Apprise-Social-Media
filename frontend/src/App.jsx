import "./App.scss";
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

  return (
    <div className="app-container">
      {authUser && <Sidebar />}

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:userName"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/search"
          element={authUser ? <SearchUsersPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUpPage />}
        />
      </Routes>

      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
