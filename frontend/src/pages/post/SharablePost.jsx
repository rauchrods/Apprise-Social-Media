import PageLayout from "../../components/pageLayout/PageLayout";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";
import PostSkeleton from "../../components/common/posts/PostSkeleton";
import Post from "../../components/common/posts/Post";

const SharablePost = () => {
  const { id: postId } = useParams();

  const {
    data: post,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["postById"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
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

  console.log("post", post);

  console.log("postId", postId);

  useEffect(() => {
    refetch();
  }, [refetch, postId]);

  return (
    <PageLayout>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && post && <Post post={post} />}
    </PageLayout>
  );
};

export default SharablePost;
