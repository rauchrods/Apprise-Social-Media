import nodemailer from "nodemailer";
import { signupOtpEmailTemplate } from "./signUpOtpEmailTemplate.js";
import dotenv from "dotenv";
import { loginOtpEmailTemplate } from "./loginOtpEmailTemplate.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: `rauchrodrigues@gmail.com`,
    pass: process.env.EMAIL_PASS_APP,
  },
});

export const sendOTPEmail = async (name, email, otp, type) => {
  try {
    await transporter.sendMail({
      from: `APPRISE <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${type} OTP Verification`,
      html:
        type === "Signup"
          ? signupOtpEmailTemplate(otp, name)
          : loginOtpEmailTemplate(otp, name),
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};
