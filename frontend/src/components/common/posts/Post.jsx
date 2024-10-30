import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../../ui/avatar/Avatar";
import "./post.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const Post = ({ post }) => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const [isLiked, SetIsLiked] = useState(() =>
    post.likes.includes(authUser?._id)
  );
  const [postLikes, SetPostLikes] = useState(() => post.likes.length);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/delete/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      if (!isLiked) {
        toast.success("Post liked successfully");
        SetPostLikes((postLikes) => postLikes + 1);
      } else {
        toast.success("Post unliked successfully");
        SetPostLikes((postLikes) => postLikes - 1);
      }

      SetIsLiked((currState) => !currState);

      // queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const postOwner = post.user;

  const isMyPost = authUser?._id === post.user?._id;

  const formattedDate = Math.floor(
    (new Date() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24)
  );
  const isCommenting = false;

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
  };

  const handleLikePost = () => {
    if (isLiking) {
      return;
    }
    likePost();
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="left-sec">
          <Avatar
            src={postOwner.profileImg || "/avatar-placeholder.png"}
            style={{ width: "35px", height: "35px", cursor: "pointer" }}
            onClick={() => navigate(`/profile/${postOwner.userName}`)}
          />

          <div className="owner-details">
            <Link to={`/profile/${postOwner.userName}`}>
              {postOwner.fullName}
            </Link>
            <Link to={`/profile/${postOwner.userName}`}>
              @{postOwner.userName}
            </Link>
            <span>{formattedDate} Days</span>
          </div>
        </div>

        {isMyPost && (
          <>
            {!isDeleting && (
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={handleDeletePost}
              />
            )}

            {isDeleting && <LoadingSpinner size={22} />}
          </>
        )}
      </div>

      <div className="post-body">
        <span className="post-text">{post.text}</span>
        <div className="post-img-holder">
          {post.image && <img src={post.image} alt="post-img" />}
        </div>

        {/* <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            }
            <dialog
              id={`comments_modal${post._id}`}
              className="modal border-none outline-none"
            >
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No comments yet 🤔 Be the first one 😉
                    </p>
                  )}
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              comment.user.profileImg ||
                              "/avatar-placeholder.png"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold">
                            {comment.user.fullName}
                          </span>
                          <span className="text-gray-700 text-sm">
                            @{comment.user.username}
                          </span>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    {isCommenting ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      "Post"
                    )}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>
          </div>
        </div> */}
      </div>
      <div className="post-footer">
        <div
          className="comment"
          onClick={() =>
            document.getElementById("comments_modal" + post._id).showModal()
          }
        >
          <FaRegComment />
          <span>{post.comments.length}</span>
        </div>
        <div className="share">
          <BiRepost />
          <span>0</span>
        </div>
        <div className="like" onClick={handleLikePost}>
          {isLiking ? (
            <LoadingSpinner size={20} />
          ) : (
            <>
              <FaRegHeart className={isLiked ? "liked" : ""} />
              <span>{postLikes}</span>
            </>
          )}
        </div>
        <div className="save">
          <FaRegBookmark />
        </div>
      </div>
    </div>
  );
};
export default Post;
