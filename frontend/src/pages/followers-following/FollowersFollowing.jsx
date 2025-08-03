import React, { useCallback, useEffect, useState } from "react";
import PageLayout from "../../components/pageLayout/PageLayout";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SuggestedUserCard from "../../components/suggestedUserCard/SuggestedUserCard";
import LoadingSpinner from "../../components/common/loadingSpinner/LoadingSpinner";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const FollowersFollowing = () => {
  const { userName, type } = useParams();

  const {
    data: users,
    isLoading,
    error,
  } = useFetch(
    `/api/users/followed-following?type=${type}&userName=${userName}`,
    {
      dependencies: [type, userName], // Refetch when type or userName changes
      enabled: !!(type && userName), // Only fetch when both params exist
      onError: (error) => {
        toast.error(error.message || "Something went wrong");
      },
    }
  );

  return (
    <PageLayout>
      <div className="search-page">
        <div className="search-header">
          <h1>{type.toUpperCase() + ` (${userName}) `}</h1>
        </div>
        <div className={`search-body${isLoading ? " body-loading" : ""}`}>
          {isLoading && <LoadingSpinner size={32} />}
          {!isLoading && users && users?.responseUsers.length === 0 && (
            <p>{type === "followers" ? "No Followers" : "No Followings"}</p>
          )}
          {!isLoading &&
            users &&
            users?.responseUsers.map((user) => (
              <SuggestedUserCard
                key={user._id}
                user={user}
                isShowElipsis={false}
              />
            ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default FollowersFollowing;
