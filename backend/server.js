import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";


//this is required below for env to work
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

//middleware
//authRoutes
app.use("/api/auth", authRouter);




app.listen(port, () => {
  console.log("server is running on port " + port);
  connectMongoDB();
});
