import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import AppriseLogo from "../../appriseLogo/AppriseLogo";
import "./sideBar.scss";
import Avatar from "../../../ui/avatar/Avatar";

const data = {
  fullName: "John Doe",
  username: "johndoe",
  profileImg: "/avatars/boy1.png",
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
    path: `/profile/${data?.username}`,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="side-bar">
      <div className="top-sec">
        <Link to="/">
          <AppriseLogo />
        </Link>
        <div className="side-bar-options">
          {options.map((option) => (
            <div
              className="side-bar-list-item"
              onClick={() => navigate(option.path)}
              key={option.name}
            >
              {option.icon}
              <span>{option.name}</span>
            </div>
          ))}
        </div>
      </div>
      {data && (
        <div
          className="bottom-sec"
          onClick={() => navigate(`/profile/${data.username}`)}
        >
          <div className="left-sec">
            <Avatar
              src={data?.profileImg || "/avatar-placeholder.png"}
              style={{ width: "40px", height: "40px" }}
            />
            <div className="hidden md:block">
              <p className="text-white font-bold text-sm w-20 truncate">
                {data?.fullName}
              </p>
              <p className="text-slate-500 text-sm">@{data?.username}</p>
            </div>
          </div>
          <div className="right-sec">
            <BiLogOut size={24} />
          </div>
        </div>
      )}
    </div>
  );
};
export default Sidebar;
