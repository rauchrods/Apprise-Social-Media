import React, { useCallback, useEffect, useState } from "react";
import PageLayout from "../../components/pageLayout/PageLayout";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SuggestedUserCard from "../../components/suggestedUserCard/SuggestedUserCard";
import LoadingSpinner from "../../components/common/loadingSpinner/LoadingSpinner";
import { useParams } from "react-router-dom";

const FollowersFollowing = () => {
  const { userName, type } = useParams();

  const {
    data: users,
    isLoading,
    error,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["myFollowedFollowingUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/users/followed-following?type=${type}&userName=${userName}`
        );
        const data = await res.json();

        if (!res.ok) {
          console.log("data: ", data);
          toast.error(data?.error || "Something went wrong");
          throw new Error(data?.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  console.log("users", users);

  return (
    <PageLayout>
      <div className="search-page">
        <div className="search-header">
          <h1>{type.toUpperCase() + ` (${userName}) `}</h1>
        </div>
        <div
          className={`search-body${
            isLoading || isRefetching ? " body-loading" : ""
          }`}
        >
          {(isLoading || isRefetching) && <LoadingSpinner size={32} />}
          {!isLoading &&
            !isRefetching &&
            users &&
            users?.responseUsers.length === 0 && (
              <p>{type === "followers" ? "No Followers" : "No Followings"}</p>
            )}
          {!isLoading &&
            !isRefetching &&
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
