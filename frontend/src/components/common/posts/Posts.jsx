import { useQuery } from "@tanstack/react-query";
// import { POSTS } from "../../../utils/db/dummy";
import Post from "./Post";
import "./posts.scss";
import PostSkeleton from "./PostSkeleton";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Posts = ({ feedType }) => {
  const { userName } = useParams();
  const getPostEndpoint = () => {
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
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
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

  // console.log("posts: ", posts);

  useEffect(() => {
    refetch();
  }, [feedType, refetch, userName]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts && posts.size === 0 && (
        <p className="no-posts">No posts in this tab. Switch 👻</p>
      )}

      {!isLoading && !isRefetching && posts && (
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
