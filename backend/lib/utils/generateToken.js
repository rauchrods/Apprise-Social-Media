import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, //in ms (1day)
    httpOnly: true, //prevents xss attack cross-site-scripting
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export const postSensitiveData = {
  user: [
    "-password",
    "-email",
    "-bio",
    "-coverImage",
    "-followers",
    "-following",
    "-likedPosts",
    "-createdAt",
    "-updatedAt",
  ],
};
