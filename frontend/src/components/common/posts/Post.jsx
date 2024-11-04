import { FaArrowLeft, FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../../ui/avatar/Avatar";
import "./post.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import { getPostFormattedDate } from "../../../utils/utilFunctions";
import Input from "../../../ui/input/Input";
import Button from "../../../ui/button/Button";
import { useSelector } from "react-redux";

const Post = ({ post }) => {
  const queryClient = useQueryClient();
  const { user: authUser } = useSelector((state) => state.auth);

  // console.log("authUser: ", authUser);

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

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
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
    onSuccess: (updatedPost) => {
      toast.success("Comment posted successfully");
      setComment("");
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.setQueryData(["posts"], (prevPosts) => {
        const updatedPosts = prevPosts?.posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              comments: updatedPost?.newComments,
            };
          }
          return p;
        });

        return {
          posts: updatedPosts,
          size: updatedPosts.length,
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const postOwner = post.user;

  const isMyPost = authUser?._id === post.user?._id;
  const isAdmin = authUser?.isAdmin;

  const formattedDate = getPostFormattedDate(post?.createdAt);

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    commentPost();
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
            src={postOwner.profileImage || "/avatar-placeholder.png"}
            style={{ width: "35px", height: "35px", cursor: "pointer" }}
            onClick={() => navigate(`/profile/${postOwner.userName}`)}
          />

          <div className="owner-details">
            <span>
              <Link to={`/profile/${postOwner.userName}`}>
                {postOwner.fullName}
              </Link>
              <Link to={`/profile/${postOwner.userName}`}>
                @{postOwner.userName}
              </Link>
            </span>

            <span>{formattedDate}</span>
          </div>
        </div>

        {(isMyPost || isAdmin) && (
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

        <dialog id={`comments-modal-${post._id}`} className="comments-modal">
          <div className="header">
            <h3>COMMENTS</h3>
            <FaArrowLeft
              onClick={() => {
                document.getElementById(`comments-modal-${post._id}`).close();
              }}
            />
          </div>

          {post.comments.length === 0 && (
            <p className="no-comments-tag">
              No comments yet 🤔 Be the first one 😉
            </p>
          )}
          <div className="comments">
            {post.comments.map((comment) => (
              <div key={comment._id} className="comment-container">
                <div className="comment-header">
                  <Avatar
                    src={comment.user.profileImage || "/avatar-placeholder.png"}
                    style={{ width: "30px", height: "30px", cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/profile/${comment.user?.userName}`)
                    }
                  />

                  <div className="right-sec">
                    <Link to={`/profile/${comment.user?.userName}`}>
                      {comment.user?.fullName}
                    </Link>
                    <Link to={`/profile/${comment.user?.userName}`}>
                      @{comment.user?.userName}
                    </Link>
                  </div>
                </div>

                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostComment}>
            <Input
              value={comment}
              isTextarea={true}
              resize="both"
              placeholder="Write a comment..."
              onChange={(e) => setComment(e.target.value)}
            />
            <Button>
              {isCommenting ? <LoadingSpinner size={20} /> : "Post"}
            </Button>
          </form>
        </dialog>
      </div>
      <div className="post-footer">
        <div
          className="comment"
          onClick={() =>
            document.getElementById("comments-modal-" + post._id).showModal()
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
