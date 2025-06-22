import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import notificationRouter from "./routes/notification.route.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { limiter } from "./middleware/rateLimiter.js";
import { startKeepAlive } from "./lib/utils/serverKeepAlive.js";

//this is required below for env to work
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const port = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

const app = express();

const _dirname = path.resolve();

//middleware below
app.use(limiter);
//to parse req.body as json
app.use(
  express.json({
    limit: "10mb",
  })
);

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

//to parse cookies
app.use(cookieParser());


//authRoutes
app.use("/api/auth", authRouter);
//userRoutes
app.use("/api/users", userRouter);
//postRoutes
app.use("/api/posts", postRouter);
//notificationRoutes
app.use("/api/notifications", notificationRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Apprise is running!",
    timestamp: new Date().toISOString(),
  });
});

if (NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log("server is running on port " + port + " and env " + NODE_ENV);
  connectMongoDB();

  // Start the keep-alive cron job (only in production)
  if (NODE_ENV === "production") {
    startKeepAlive();
  }
});
