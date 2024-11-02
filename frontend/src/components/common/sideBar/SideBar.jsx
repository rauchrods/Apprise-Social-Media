import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import AppriseLogo from "../../appriseLogo/AppriseLogo";
import "./sideBar.scss";
import Avatar from "../../../ui/avatar/Avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const data = {
  fullName: "John Doe",
  username: "johndoe",
  profileImg: "/avatars/boy1.png",
};

const Sidebar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();
        console.log("data: ", data);
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Logged Out successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

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
  ];

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
      {authUser && (
        <div className="bottom-sec">
          <div
            className="left-sec"
            onClick={() => navigate(`/profile/${authUser.userName}`)}
          >
            <Avatar
              src={authUser?.profileImage || "/avatar-placeholder.png"}
              style={{ width: "40px", height: "40px" }}
            />
            <div className="user-details">
              <p>{authUser?.fullName}</p>
              <p>@{authUser?.userName}</p>
            </div>
          </div>
          <div
            className="right-sec"
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
          >
            <BiLogOut size={24} />
          </div>
        </div>
      )}
    </div>
  );
};
export default Sidebar;
