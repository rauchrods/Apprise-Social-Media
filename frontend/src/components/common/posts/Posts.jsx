// import PostSkeleton from "../skeletons/PostSkeleton";

import { POSTS } from "../../../utils/db/dummy";
import Post from "./Post";
import './posts.scss';
import PostSkeleton from "./PostSkeleton";

const Posts = () => {
  const isLoading = false;

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton/>
          <PostSkeleton/>
          <PostSkeleton/>
        </div>
      )}
      {!isLoading && POSTS?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && POSTS && (
        <div className="display-posts">
          {POSTS.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
