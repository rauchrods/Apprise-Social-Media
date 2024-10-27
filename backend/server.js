import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import notificationRouter from "./routes/notification.route.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

//this is required below for env to work
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const port = process.env.PORT || 3000;

const app = express();

//middleware below

//to parse req.body as json
app.use(
  express.json({
    limit: "5mb",
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

app.listen(port, () => {
  console.log("server is running on port " + port);
  connectMongoDB();
});
