import { useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import PageLayout from "../../components/pageLayout/PageLayout";
import LoadingSpinner from "../../components/common/loadingSpinner/LoadingSpinner";
import Avatar from "../../ui/avatar/Avatar";
import "./notificationPage.scss";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications/all");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: deleteAll , isPending} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications/all", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("All notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  //  console.log("notifications: ", notifications);

  const handleSettingButton = () => {
    setOpen((currState) => !currState);
  };

  const deleteAllNotifications = () => {
    setOpen(false);
    deleteAll();
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
        {(isLoading || isPending) && <LoadingSpinner size={"40"} />}
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
