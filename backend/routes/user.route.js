import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getFollowedFollowingUsers,
  getSearchedUsers,
  getSuggestedUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:userName", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/search", protectRoute, getSearchedUsers);
router.get("/followed-following", protectRoute, getFollowedFollowingUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUserProfile);

export default router;
