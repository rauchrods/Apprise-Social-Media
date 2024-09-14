import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected to: " + connection.connection.host);
  } catch (error) {
    console.error(`Error connecting to MongoDB : ${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
