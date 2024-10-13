import React from "react";
import './avatar.scss';

const Avatar = ({ src, ...props }) => {
  return <img src={src} alt={"avatar"} className={`user-avatar`} {...props} />;
};

export default Avatar;
