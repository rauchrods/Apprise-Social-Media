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

export const getSearchedUsers = async (req, res) => {
  try {
    const currentUser = req.user;

    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(200).json({
        users: [],
        size: 0,
      });
    }

    const searchRegex = new RegExp(searchQuery, "i");

    const users = await User.find({
      $and: [
        // Search criteria
        { $or: [{ userName: searchRegex }, { fullName: searchRegex }] },
        // Exclude current user
        { _id: { $ne: currentUser._id } },
      ],
    })
      .select([
        "userName",
        "fullName",
        "profileImage",
        "bio",
        "isVerified",
        "link",
        "followers",
        "following",
      ])
      .limit(10)
      .lean();

    users.sort((a, b) => {
      // Check if users are mutually following/followed by current user
      const aIsMutual =
        currentUser.following.some((id) => id.equals(a._id)) &&
        currentUser.followers.some((id) => id.equals(a._id));
      const bIsMutual =
        currentUser.following.some((id) => id.equals(b._id)) &&
        currentUser.followers.some((id) => id.equals(b._id));

      // Check if users are followed by current user
      const aIsFollowed = currentUser.following.some((id) => id.equals(a._id));
      const bIsFollowed = currentUser.following.some((id) => id.equals(b._id));

      // Check if users are followers of current user
      const aIsFollower = currentUser.followers.some((id) => id.equals(a._id));
      const bIsFollower = currentUser.followers.some((id) => id.equals(b._id));

      // 1. Mutual follows get highest priority
      if (aIsMutual && !bIsMutual) return -1;
      if (!aIsMutual && bIsMutual) return 1;

      // 2. Users followed by current user get second priority
      if (aIsFollowed && !bIsFollowed) return -1;
      if (!aIsFollowed && bIsFollowed) return 1;

      // 3. Followers of current user get third priority
      if (aIsFollower && !bIsFollower) return -1;
      if (!aIsFollower && bIsFollower) return 1;

      // 4. If none of the above, sort by followers count
      return b.followers.length - a.followers.length;
    });
    res.status(200).json({
      users,
      size: users.length,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getFollowedFollowingUsers = async (req, res) => {
  try {
    const { type, userName } = req.query;

    const authUser = req.user;

    if (!type || !userName || (type !== "followers" && type !== "following")) {
      return res.status(400).json({
        error: "Invalid type",
      });
    }

    const currentUser = await User.findOne({ userName: userName }).select(
      "-password"
    );
    if (!currentUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    let users = [];

    if (type === "followers") {
      users = currentUser?.followers;
    } else {
      users = currentUser?.following;
    }

    if (!users || users.length === 0) {
      return res.status(200).json({
        responseUsers: [],
        size: 0,
      });
    }

    //exclude the auth user
    const responseUsers = await User.find({
      _id: { $in: users },
    }).select([
      "userName",
      "fullName",
      "profileImage",
      "bio",
      "isVerified",
      "link",
      "followers",
      "following",
    ]);
    res.status(200).json({ responseUsers, size: responseUsers.length });
  } catch (error) {
    console.log(error.message);
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
    console.log(error);
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
      const uploadResult = await cloudinary.uploader.upload(coverImage);

      coverImage = uploadResult.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.userName = userName || user.userName;
    // user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;

    user = await user.save();

    user.password = null;

    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: `Internal server error: ${error.message}`,
    });
  }
};
