import React, { useCallback, useEffect, useState } from "react";
import PageLayout from "../../components/pageLayout/PageLayout";
import Input from "../../ui/input/Input";
import { FaSearch } from "react-icons/fa";
import "./searchUsersPage.scss";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SuggestedUserCard from "../../components/suggestedUserCard/SuggestedUserCard";
import LoadingSpinner from "../../components/common/loadingSpinner/LoadingSpinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";

const SearchUsersPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("searchQuery");

//   console.log("searchQuery: ", searchQuery);

  const debouncedNavigate = useCallback(
    debounce((value) => {
      if (value) {
        navigate(`/search?searchQuery=${value}`);
      } else {
        navigate("/search");
      }
    }, 600),
    [navigate]
  );

  useEffect(() => {
    return () => {
      debouncedNavigate.cancel();
    };
  }, [debouncedNavigate]);

  const {
    data: searchedUsers,
    isLoading,
    error,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["searchedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/search?searchQuery=${searchQuery}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    refetch();
  }, [searchQuery]);

  return (
    <PageLayout>
      <div className="search-page">
        <div className="search-header">
          <Input
            inputIcon={<FaSearch size={18} />}
            type="search"
            placeholder="Search Users"
            className="search-users-input"
            onChange={(e) => debouncedNavigate(e.target.value)}
          />
        </div>
        <div className="search-body">
          {(isLoading || isRefetching) && <LoadingSpinner size={32} />}
          {!isLoading &&
            !isRefetching &&
            searchedUsers &&
            searchedUsers?.size === 0 && <p>No results found Search by Username or Full Name</p>}
          {!isLoading &&
            !isRefetching &&
            searchedUsers &&
            searchedUsers?.users.map((user) => (
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

export default SearchUsersPage;
