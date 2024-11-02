import { Skeleton } from "@mui/material";
import React from "react";
import "./profilePage.scss";

const ProfileHeaderSkeleton = () => {
  const constant = { backgroundColor: "rgb(150, 150, 150)" };

  return (
    <>
      <div className="header">
        <Skeleton variant="circular" width={30} height={30} sx={constant} />
        <div className="header-info">
          <Skeleton
            variant="rectangular"
            width={120}
            height={30}
            sx={constant}
          />
        </div>
      </div>
      {/* COVER IMG */}
      <div className="profile-img-sec">
        <div className="cover-img-container">
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={160}
            sx={constant}
          />
        </div>

        {/* USER AVATAR */}

        <div className="profile-pic-container">
          <Skeleton variant="rounded" width={100} height={100} sx={constant} />
        </div>
      </div>
      <div className="btn-sec">
        <Skeleton variant="rectangular" width={100} height={30} sx={constant} />
      </div>

      <div className="profile-details">
        <div className="main-details">
          <span className="full-name">
            <Skeleton
              variant="rectangular"
              width={150}
              height={30}
              sx={constant}
            />
          </span>
          <span className="user-name">
            <Skeleton
              variant="rectangular"
              width={150}
              height={20}
              sx={constant}
            />
          </span>
          <span className="bio">
            <Skeleton
              variant="rectangular"
              width={150}
              height={20}
              sx={constant}
            />
          </span>
        </div>

        <div className="link-join-date">
          <Skeleton
            variant="rectangular"
            width={100}
            height={20}
            sx={constant}
          />
        </div>
        <div className="follow-following-sec">
          <div className="following-sec">
            <span>
              <Skeleton
                variant="rectangular"
                width={30}
                height={20}
                sx={constant}
              />
            </span>
            <span>
              <Skeleton
                variant="rectangular"
                width={80}
                height={20}
                sx={constant}
              />
            </span>
          </div>
          <div className="followers-sec">
            <span>
              <Skeleton
                variant="rectangular"
                width={30}
                height={20}
                sx={constant}
              />
            </span>
            <span>
              <Skeleton
                variant="rectangular"
                width={80}
                height={20}
                sx={constant}
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeaderSkeleton;
