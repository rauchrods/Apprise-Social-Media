import React, { useState } from "react";
import AppriseLogo from "../../components/appriseLogo/AppriseLogo";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import "./signUpPage.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Credit from "../../ui/credit/Credit";
import { trimObjectValues } from "../../utils/utilFunctions";

const SignUpPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    fullName: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);

  const {
    mutate: signUp,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        console.log(error);
        // toast.error(error.message);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("OTP Sent successfully!");
      setOtpSent(true);
      // queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const { mutate: validateOtp, isPending: isValidatingOtp } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/auth/validate-signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("User Created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!otpSent) {
      signUp(trimObjectValues(formData));
    } else {
      validateOtp(trimObjectValues(formData));
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="sign-up-page">
      <div className="left-sec">
        <AppriseLogo style={{ fontSize: "32px" }} />
      </div>
      <div className="right-sec">
        <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          {!otpSent ? (
            <>
              <Input
                inputIcon={<MdOutlineMail />}
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
              />

              <Input
                inputIcon={<FaUser />}
                type="text"
                placeholder="Username"
                name="userName"
                onChange={handleInputChange}
                value={formData.userName}
              />

              <Input
                inputIcon={<MdDriveFileRenameOutline />}
                type="text"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />

              <Input
                inputIcon={<MdPassword />}
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </>
          ) : (
            <Input
              inputIcon={<MdPassword />}
              type="number"
              placeholder="OTP"
              name="otp"
              onChange={handleInputChange}
              value={formData.otp}
            />
          )}

          <Button className="auth-btn" disabled={isPending || isValidatingOtp}>
            {isPending || isValidatingOtp
              ? "Loading"
              : !otpSent
              ? "Sign Up"
              : "Submit Otp"}
          </Button>
          {isError && <p className="error-msg">{error.message}</p>}
        </form>
        <div className="bottom-navigation">
          <p>Already have an account?</p>

          <Button
            className="invert-btn auth-btn"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </div>
        <Credit style={{ fontSize: "15px" }} />
      </div>
    </div>
  );
};
export default SignUpPage;
