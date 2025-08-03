import { useQuery } from "@tanstack/react-query";
// import { POSTS } from "../../../utils/db/dummy";
import Post from "./Post";
import "./posts.scss";
import PostSkeleton from "./PostSkeleton";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";

const Posts = ({ feedType }) => {
  const { userName } = useParams();
  const getPostEndpoint = useCallback(() => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${userName}`;
      case "liked":
        return `/api/posts/liked/${userName}`;
      default:
        return "/api/posts/all";
    }
  }, [feedType, userName]);

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
  } = useFetch(POST_ENDPOINT, {
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  // console.log("posts: ", posts);

  useEffect(() => {
    refetch();
  }, [feedType, userName]);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts && posts.size === 0 && (
        <p className="no-posts">No posts in this tab. Switch 👻</p>
      )}

      {!isLoading && posts && (
        <div className="display-posts">
          {posts.posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
