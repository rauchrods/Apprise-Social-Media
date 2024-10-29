import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // 5 minutes
  },
});

const Otp = mongoose.model("Otp", OTPSchema);
export default Otp;
