import React from "react";
import Skeleton from "@mui/material/Skeleton";

const SuggestedUserCardSkeleton = () => {
  const constant = { backgroundColor: "rgb(150, 150, 150)" };
  return (
    <div className="suggested-user-card">
      <div className="left-sec">
        <Skeleton variant="circular" width={30} height={30} sx={constant} />

        <div className="details">
          <Skeleton variant="text" width={70} height={16} sx={constant} />
          <Skeleton variant="text" width={70} height={16} sx={constant} />
        </div>
      </div>

      <Skeleton variant="rounded" width={50} height={20} sx={constant} />
    </div>
  );
};

export default SuggestedUserCardSkeleton;
