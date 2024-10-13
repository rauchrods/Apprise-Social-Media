import { Skeleton } from "@mui/material";
import React from "react";
import "./post.scss";

const PostSkeleton = () => {
  const constant = { backgroundColor: "rgb(150, 150, 150)" };
  return (
    <div className="post-container">
      <div className="post-header">
        <div className="left-sec">
          <Skeleton variant="circular" width={30} height={30} sx={constant} />

          <div className="owner-details">
            <Skeleton variant="text" width={70} height={16} sx={constant} />
            <Skeleton variant="text" width={70} height={16} sx={constant} />
            <Skeleton variant="text" width={40} height={16} sx={constant} />
          </div>
        </div>
      </div>

      <div className="post-body">
        <Skeleton variant="text" width={400} height={16} sx={constant} />

        <Skeleton variant="rounded" width={460} height={200} sx={constant} />
      </div>
      <div className="post-footer">
        <div className="comment">
          <Skeleton variant="rounded" width={20} height={20} sx={constant} />
          <Skeleton variant="rounded" width={20} height={20} sx={constant} />
        </div>
        <div className="share">
          <Skeleton variant="rounded" width={20} height={20} sx={constant} />
          <Skeleton variant="rounded" width={20} height={20} sx={constant} />
        </div>
        <div className="like">
          <Skeleton variant="rounded" width={20} height={20} sx={constant} />
          <Skeleton variant="rounded" width={20} height={20} sx={constant} />
        </div>
        <div className="save">
          <Skeleton variant="rounded" width={20} height={20} sx={constant} />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
