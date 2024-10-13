import "./App.scss";
import { Route, Routes, useLocation } from "react-router-dom";
import SignUpPage from "./pages/signup/SignUpPage";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/sideBar/SideBar";
import RightPanel from "./components/rightPanel/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <div className="app-container">
      {pathname !== "/login" && pathname !== "/signup" && <Sidebar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>

      {pathname !== "/login" && pathname !== "/signup" && <RightPanel />}
    </div>
  );
}

export default App;
