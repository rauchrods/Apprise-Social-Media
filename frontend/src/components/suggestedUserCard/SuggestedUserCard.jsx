import React from "react";
import "./suggestedUserCard.scss";
import Button from "../../ui/button/Button";
import Avatar from "../../ui/avatar/Avatar";
import { useNavigate } from "react-router-dom";

const SuggestedUserCard = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div
      className="suggested-user-card"
      onClick={() => navigate(`/profile/${user.username}`)}
    >
      <div className="left-sec">
        <Avatar
          src={user.profileImg || "/avatar-placeholder.png"}
          style={{ width: "30px", height: "30px" }}
        />

        <div className="details">
          <span className="full-name">{user.fullName}</span>
          <span className="user-name">@{user.username}</span>
        </div>
      </div>

      <Button
        className="invert-btn"
        onClick={(e) => e.preventDefault()}
        style={{ padding: "6px 8px" }}
      >
        Follow
      </Button>
    </div>
  );
};

export default SuggestedUserCard;
