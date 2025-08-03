import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import AppriseLogo from "../../appriseLogo/AppriseLogo";
import "./sideBar.scss";
import Avatar from "../../../ui/avatar/Avatar";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/features/authSlice";
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";

const Sidebar = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 900);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { execute: logoutUser, isLoading: isLoggingOut } = useFetch(
    "/api/auth/logout",
    {
      method: "POST",
      onSuccess: () => {
        toast.success("Logged Out successfully");
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message || "Logout failed");
      },
    }
  );

  const handleLogout = async (e) => {
    e.preventDefault();
    if (isLoggingOut) return;

    try {
      dispatch(logout());
      await logoutUser();
    } catch (error) {
      // Error already handled by onError callback
      console.error("Logout failed:", error);
    }
  };

  const options = [
    {
      name: "Home",
      icon: <MdHomeFilled size={22} />,
      path: "/",
    },
    {
      name: "Notifications",
      icon: <IoNotifications size={22} />,
      path: "/notifications",
    },
    {
      name: "Profile",
      icon: <FaUser size={22} />,
      path: `/profile/${authUser?.userName}`,
    },
    {
      name: "Search",
      icon: <FaSearch size={22} />,
      path: `/search/`,
    },
    {
      name: "Suggestions",
      icon: <FaUsers size={22} />,
      path: `/suggested/users`,
    },
  ];

  return (
    <div className={`side-bar${isMobileView ? " mobile-view" : ""}`}>
      <div className="top-sec">
        <Link to="/">
          <AppriseLogo text={isMobileView ? "A" : "Apprise"} />
        </Link>
        <div className="side-bar-options">
          {options.map((option) => (
            <div
              className="side-bar-list-item"
              onClick={() => navigate(option.path)}
              key={option.name}
            >
              {option.icon}
              {!isMobileView && <span>{option.name}</span>}
            </div>
          ))}
        </div>
      </div>
      {authUser && (
        <div className="bottom-sec">
          <div
            className="left-sec"
            onClick={() => navigate(`/profile/${authUser.userName}`)}
          >
            <Avatar
              src={authUser?.profileImage || "/avatar-placeholder.png"}
              style={
                isMobileView
                  ? { width: "35px", height: "35px" }
                  : { width: "40px", height: "40px" }
              }
            />
            {!isMobileView && (
              <div className="user-details">
                <p>{authUser?.fullName}</p>
                <p>@{authUser?.userName}</p>
              </div>
            )}
          </div>
          <div className="right-sec" onClick={handleLogout}>
            <BiLogOut size={24} />
          </div>
        </div>
      )}
    </div>
  );
};
export default Sidebar;
