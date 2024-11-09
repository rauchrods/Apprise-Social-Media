import { postSensitiveData } from "../lib/utils/generateToken.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    let { text, image } = req.body;

    const userId = req.user._id.toString();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (!text && !image) {
      return res.status(400).json({
        error: "Text or image is required to create a post",
      });
    }

    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image);

      image = uploadResult.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      image,
    });

    await newPost.save();

    res.status(201).json({
      newPost,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        error: "You are not authorized to delete this post",
      });
    }

    if (post.image) {
      const imageId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imageId);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    const newComment = {
      user: userId,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    const newPost = await Post.findById(postId)
    .populate({
      path: "comments.user",
      select: [
        "-password",
        "-email",
        "-bio",
        "-coverImage",
        "-followers",
        "-following",
        "-likedPosts",
        "-createdAt",
        "-updatedAt",
        "-isAdmin",
        "-isVerified",
      ],
    });

    res.status(200).json({
      message: "Comment added successfully",
      newComments: newPost.comments,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //unlike post
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });

      await User.findByIdAndUpdate(userId, {
        $pull: { likedPosts: postId },
      });

      res.status(200).json({
        message: "Post unliked successfully",
      });
    } else {
      //like post
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: userId },
      });

      await User.findByIdAndUpdate(userId, {
        $push: { likedPosts: postId },
      });

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await notification.save();

      res.status(200).json({
        message: "Post liked successfully",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: [
          "-password",
          "-email",
          "-bio",
          "-coverImage",
          "-followers",
          "-following",
          "-likedPosts",
          "-createdAt",
          "-updatedAt",
          "-isAdmin",
          "-isVerified",
        ],
      })
      .populate({
        path: "comments.user",
        select: [
          "-password",
          "-email",
          "-bio",
          "-coverImage",
          "-followers",
          "-following",
          "-likedPosts",
          "-createdAt",
          "-updatedAt",
          "-isAdmin",
          "-isVerified",
        ],
      });

    // const sortedPosts = posts.sort((a, b) => {
    //   if (
    //     currentUser._id.equals(a.user._id) &&
    //     !currentUser._id.equals(b.user._id)
    //   ) {
    //     return -1;
    //   }
    //   if (
    //     !currentUser._id.equals(a.user._id) &&
    //     currentUser._id.equals(b.user._id)
    //   ) {
    //     return 1;
    //   }
    //   if (
    //     currentUser.following.includes(a.user._id) &&
    //     !currentUser.following.includes(b.user._id)
    //   ) {
    //     return -1;
    //   }
    //   if (
    //     !currentUser.following.includes(a.user._id) &&
    //     currentUser.following.includes(b.user._id)
    //   ) {
    //     return 1;
    //   }
    //   if (a.likes.length !== b.likes.length) {
    //     return b.likes.length - a.likes.length;
    //   }

    //   return b.createdAt - a.createdAt;
    // });

    res.status(200).json({
      posts,
      size: posts.length,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: ["-password", "-email"] });
    res.status(200).json({
      posts: likedPosts,
      size: likedPosts.length,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const followingPosts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: ["-password", "-email"] });
    res.status(200).json({
      posts: followingPosts,
      size: followingPosts.length,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName }).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const userPosts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: ["-password", "-email"] });
    res.status(200).json({
      posts: userPosts,
      size: userPosts.length,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
