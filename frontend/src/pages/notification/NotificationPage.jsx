import { useNavigate } from "react-router-dom";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import PageLayout from "../../components/pageLayout/PageLayout";
import LoadingSpinner from "../../components/common/loadingSpinner/LoadingSpinner";
import Avatar from "../../ui/avatar/Avatar";
import "./notificationPage.scss";
import { useState } from "react";

const NotificationPage = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLoading = false;
  const notifications = [
    {
      _id: "1",
      from: {
        _id: "1",
        username: "johndoe",
        profileImg: "/avatars/boy2.png",
      },
      type: "follow",
    },
    {
      _id: "2",
      from: {
        _id: "2",
        username: "janedoe",
        profileImg: "/avatars/girl1.png",
      },
      type: "like",
    },
  ];

  const handleSettingButton = () => {
    setOpen((currState) => !currState);
  };

  const deleteNotifications = () => {
    alert("All notifications deleted");
  };

  return (
    <PageLayout>
      <div className="notification-page">
        <div className="header">
          <p className="font-bold">Notifications</p>
          <div className="dropdown-setting">
            <IoSettingsOutline onClick={handleSettingButton} />

            {open && (
              <div className="items">
                <span onClick={deleteNotifications}>
                  Delete all notifications
                </span>
              </div>
            )}
          </div>
        </div>
        {isLoading && <LoadingSpinner size={"40"} />}
        {!isLoading && notifications?.length === 0 && (
          <div>No notifications 🤔</div>
        )}
        {!isLoading &&
          notifications?.map((notification) => (
            <div className="notification" key={notification._id}>
              <div className="type">
                {notification.type === "follow" && (
                  <FaUser className="follow" />
                )}
                {notification.type === "like" && <FaHeart className="like" />}
              </div>
              <div
                className="mid-sec"
                onClick={() =>
                  navigate(`/profile/${notification.from.username}`)
                }
              >
                <Avatar
                  src={
                    notification.from.profileImg || "/avatar-placeholder.png"
                  }
                  style={{ width: "40px", height: "40px" }}
                ></Avatar>

                <div className="details">
                  <span>@{notification.from.username}</span>{" "}
                  <span>
                    {notification.type === "follow"
                      ? "followed you"
                      : "liked your post"}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </PageLayout>
  );
};
export default NotificationPage;
