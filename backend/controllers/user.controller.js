import bcrypt from "bcryptjs";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName: userName }).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        error: "You cannot follow/unfollow yourself",
      });
    }

    if (!userToModify || !currentUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //unfollow user
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });

      //TODO: return the id of the user as aresponse

      res.status(200).json({ message: "User Unfollowed successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });

      //Send Notification to user

      const newNotification = new Notification({
        from: req.user._id,
        to: id,
        type: "follow",
      });

      await newNotification.save();

      //TODO: return the id of the user as aresponse

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: userId,
          },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 5);

    suggestedUsers.forEach((user) => (user.password = null));
    res
      .status(200)
      .json({ users: suggestedUsers, size: suggestedUsers.length });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    let {
      userName,
      fullName,
      email,
      profileImage,
      coverImage,
      bio,
      link,
      currentPassword,
      newPassword,
    } = req.body;

    let user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Both current password and new Password is required",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          error: "Current password is incorrect",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "Password should be at least 6 characters",
        });
      }

      if (newPassword === currentPassword) {
        return res.status(400).json({
          error: "New password should be different from current password",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImage) {
      if (user.profileImage) {
        await cloudinary.uploader.destroy(
          user.profileImage.split("/").pop().split(".")[0]
        );
      }
      const uploadResult = await cloudinary.uploader.upload(profileImage);

      profileImage = uploadResult.secure_url;
    }

    if (coverImage) {
      if (user.coverImage) {
        await cloudinary.uploader.destroy(
          user.coverImage.split("/").pop().split(".")[0]
        );
      }
      const uploadResult = await cloudinary.uploader.upload(coverImage, {
        public_id: "cover-image",
      });

      coverImage = uploadResult.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;

    user = await user.save();

    user.password = null;

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: `Internal server error: ${error.message}`,
    });
  }
};
