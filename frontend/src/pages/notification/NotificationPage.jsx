import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaComment, FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import PageLayout from "../../components/pageLayout/PageLayout";
import LoadingSpinner from "../../components/common/loadingSpinner/LoadingSpinner";
import Avatar from "../../ui/avatar/Avatar";
import "./notificationPage.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";

const NotificationPage = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useFetch("/api/notifications/all", {
    onError: (err) => {
      toast.error(err.message || "Failed to fetch notifications");
    },
  });

  const { execute: deleteAll, isLoading: isDeleteAllLoading } = useFetch(
    "/api/notifications/all",
    {
      method: "DELETE",
      onSuccess: () => {
        toast.success("All notifications deleted successfully");
        refetch(); // Refetch notifications after deletion
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete notifications");
      },
    }
  );

  //  console.log("notifications: ", notifications);

  const handleSettingButton = () => {
    setOpen((currState) => !currState);
  };

  const deleteAllNotifications = async () => {
    setOpen(false);
    try {
      await deleteAll(); // Execute the DELETE request
    } catch (error) {
      console.error("Delete failed:", error);
    }
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
                <span onClick={deleteAllNotifications}>
                  Delete all notifications
                </span>
              </div>
            )}
          </div>
        </div>
        {(isLoading || isDeleteAllLoading) && <LoadingSpinner size={"40"} />}
        {!isLoading && notifications && notifications?.size === 0 && (
          <div className="no-notification">No notifications 🤔</div>
        )}
        {!isLoading &&
          notifications &&
          notifications.notifications?.map((notification) => (
            <div className="notification" key={notification._id}>
              <div className="type">
                {notification.type === "follow" && (
                  <FaUser className="follow" />
                )}
                {notification.type === "like" && <FaHeart className="like" />}
                {notification.type === "comment" && (
                  <FaComment className="comment" />
                )}
              </div>
              <div
                className="mid-sec"
                onClick={() =>
                  navigate(`/profile/${notification.from.userName}`)
                }
              >
                <Avatar
                  src={
                    notification.from.profileImage || "/avatar-placeholder.png"
                  }
                  style={{ width: "40px", height: "40px" }}
                ></Avatar>

                <div className="details">
                  <span>@{notification.from.userName}</span>{" "}
                  <span>
                    {notification.type === "follow"
                      ? "followed you"
                      : notification.type === "like"
                      ? "liked your post"
                      : "commented on your post"}
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
