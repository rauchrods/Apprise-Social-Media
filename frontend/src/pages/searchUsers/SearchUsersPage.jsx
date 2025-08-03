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
import useFetch from "../../hooks/useFetch";

const SearchUsersPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let searchQuery = searchParams.get("searchQuery");

  searchQuery = searchQuery ? searchQuery.trim() : "";

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
  } = useFetch(`/api/users/search?searchQuery=${searchQuery}`, {
    onError: (error) => {
      toast.error(error.message || "Search failed");
    },
  });

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
        <div className={`search-body${isLoading ? " body-loading" : ""}`}>
          {isLoading && <LoadingSpinner size={32} />}
          {!isLoading && searchedUsers && searchedUsers?.size === 0 && (
            <p>No results found Search by Username or Full Name</p>
          )}
          {!isLoading &&
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
