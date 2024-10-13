import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../../ui/avatar/Avatar";
import "./post.scss";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const postOwner = post.user;
  const isLiked = true;

  const isMyPost = true;

  const formattedDate = "1h";

  const isCommenting = false;

  const handleDeletePost = () => {};

  const handlePostComment = (e) => {
    e.preventDefault();
  };

  const handleLikePost = () => {};

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="left-sec">
          <Avatar
            src={postOwner.profileImg || "/avatar-placeholder.png"}
            style={{ width: "35px", height: "35px", cursor: "pointer" }}
            onClick={() => navigate(`/profile/${postOwner.username}`)}
          />

          <div className="owner-details">
            <Link to={`/profile/${postOwner.username}`}>
              {postOwner.fullName}
            </Link>
            <Link to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
            <span>{formattedDate}</span>
          </div>
        </div>

        {isMyPost && (
          <FaTrash
            className="cursor-pointer hover:text-red-500"
            onClick={handleDeletePost}
          />
        )}
      </div>

      <div className="post-body">
        <span className="post-text">{post.text}</span>
        <div className="post-img-holder">
          {post.img && <img src={post.img} alt="post-img" />}
        </div>

        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            {/* We're using Modal Component from DaisyUI */}
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
        </div>
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
          <FaRegHeart className={isLiked ? "liked" : ""} />

          <span>{post.likes.length}</span>
        </div>
        <div className="save">
          <FaRegBookmark />
        </div>
      </div>
    </div>
  );
};
export default Post;
