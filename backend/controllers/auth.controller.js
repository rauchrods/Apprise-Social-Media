import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { userName, fullName, email, password } = req.body;

    if (!userName || !fullName || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Passwprd should be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        error: "UserName already exists",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      userName,
      fullName,
      email,
      password: hashedPassword,
    });

    // console.log(newUser);

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImage: newUser.profileImage,
        coverImage: newUser.coverImage,
        bio: newUser.bio,
        link: newUser.link,
      });
    } else {
      return res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password should be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser?.password || ""
    );

    if (!existingUser || !isPasswordMatch) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    generateTokenAndSetCookie(existingUser._id, res);

    res.status(200).json({
      _id: existingUser._id,
      fullName: existingUser.fullName,
      userName: existingUser.userName,
      email: existingUser.email,
      followers: existingUser.followers,
      following: existingUser.following,
      profileImage: existingUser.profileImage,
      coverImage: existingUser.coverImage,
      bio: existingUser.bio,
      link: existingUser.link,
    });
  } catch (error) {
    console.log(`Error in login: ${error.message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "logged out successfully",
    });
  } catch (error) {
    console.log(`Error in login: ${error.message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getME = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in login: ${error.message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
