import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

//this is required below for env to work
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

//middleware below

//to parse req.body as json
app.use(express.json());

//to parse cookies
app.use(cookieParser());

//authRoutes
app.use("/api/auth", authRouter);



app.listen(port, () => {
  console.log("server is running on port " + port);
  connectMongoDB();
});
