import express from "express";
import {
  getME,
  login,
  logout,
  signup,
  validateOtplogin,
  validateOtpSignup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getME);

router.post("/signup", signup);

router.post("/validate-signup", validateOtpSignup);

router.post("/validate-login", validateOtplogin);

router.post("/login", login);

router.post("/logout", logout);

export default router;
