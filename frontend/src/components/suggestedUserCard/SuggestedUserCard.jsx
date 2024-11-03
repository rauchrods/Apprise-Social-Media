import React from "react";
import "./suggestedUserCard.scss";
import Button from "../../ui/button/Button";
import Avatar from "../../ui/avatar/Avatar";
import { useNavigate } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../common/loadingSpinner/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";

const SuggestedUserCard = ({ user, isShowElipsis = true }) => {
  const navigate = useNavigate();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const iFollowing = authUser?.following.includes(user?._id);
  const { followUnfollow, isPending } = useFollow();

  const followUnfollowHandler = (e) => {
    e.preventDefault();
    followUnfollow({ id: user._id });
  };

  return (
    <div
      className="suggested-user-card"
      onClick={() => navigate(`/profile/${user.userName}`)}
    >
      <div className="left-sec">
        <Avatar
          src={user.profileImg || "/avatar-placeholder.png"}
          style={{ width: "30px", height: "30px" }}
        />

        <div className={`details`}>
          <span className={`full-name ${isShowElipsis ? "show-elipsis" : ""}`}>
            {user.fullName}
          </span>
          <span className={`user-name ${isShowElipsis ? "show-elipsis" : ""}`}>
            @{user.userName}
          </span>
        </div>
      </div>

      <Button
        className="invert-btn"
        onClick={followUnfollowHandler}
        style={{ padding: "6px 8px" }}
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner size={16} />
        ) : iFollowing ? (
          "Unfollow"
        ) : (
          "Follow"
        )}
      </Button>
    </div>
  );
};

export default SuggestedUserCard;
