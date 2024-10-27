import React from "react";
import "./suggestedUserCard.scss";
import Button from "../../ui/button/Button";
import Avatar from "../../ui/avatar/Avatar";
import { useNavigate } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../common/loadingSpinner/LoadingSpinner";

const SuggestedUserCard = ({ user }) => {
  const navigate = useNavigate();

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

        <div className="details">
          <span className="full-name">{user.fullName}</span>
          <span className="user-name">@{user.userName}</span>
        </div>
      </div>

      <Button
        className="invert-btn"
        onClick={followUnfollowHandler}
        style={{ padding: "6px 8px" }}
        disabled={isPending}
      >
        {isPending ? <LoadingSpinner size={16}/> : "Follow"}
      </Button>
    </div>
  );
};

export default SuggestedUserCard;
