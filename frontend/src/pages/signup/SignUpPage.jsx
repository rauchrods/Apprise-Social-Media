import { useState } from "react";
import AppriseLogo from "../../components/appriseLogo/AppriseLogo";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import "./signUpPage.scss";
import toast from "react-hot-toast";
import Credit from "../../ui/credit/Credit";
import { trimObjectValues } from "../../utils/utilFunctions";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";

const SignUpPage = ({ getAuthUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    fullName: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval = null;

    if (otpSent && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setOtpSent(false);
            toast.error("OTP expired. Please request a new one.");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [otpSent, timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const {
    execute: signUp,
    isLoading: isSignupLoading,
    error: signupError,
  } = useFetch("/api/auth/signup", {
    method: "POST",
    onSuccess: (data) => {
      console.log(data);
      toast.success("OTP Sent successfully!");
      setOtpSent(true);
      setTimeLeft(300); // 5 minutes = 300 seconds
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send OTP");
    },
  });

  const { execute: validateOtp, isLoading: isValidatingOtp } = useFetch(
    "/api/auth/validate-signup",
    {
      method: "POST",
      onSuccess: (data) => {
        console.log(data);
        toast.success("User Created Successfully!");
        getAuthUser(); // Refetch auth user data
      },
      onError: (error) => {
        toast.error(error.message || "Invalid OTP");
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedData = trimObjectValues(formData);

    try {
      if (!otpSent) {
        // Send OTP for signup
        signUp(null, { body: trimmedData });
      } else {
        // Validate OTP and create account
        validateOtp(null, { body: trimmedData });
      }
    } catch (error) {
      // Errors are already handled by onError callbacks
      console.error("Signup flow error:", error);
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
                inputIcon={
                  showPassword ? <MdVisibility /> : <MdVisibilityOff />
                }
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                iconAction={() => setShowPassword((currState) => !currState)}
              />
            </>
          ) : (
            <>
              <Input
                inputIcon={<MdPassword />}
                type="number"
                placeholder="OTP"
                name="otp"
                onChange={handleInputChange}
                value={formData.otp}
              />
              <div
                className="credit-text"
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                Time remaining: {formatTime(timeLeft)}
              </div>
            </>
          )}

          <Button
            className="auth-btn"
            disabled={isSignupLoading || isValidatingOtp}
          >
            {isSignupLoading || isValidatingOtp
              ? "Loading"
              : !otpSent
              ? "Sign Up"
              : "Submit Otp"}
          </Button>
          {signupError && <p className="error-msg">{signupError}</p>}
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
