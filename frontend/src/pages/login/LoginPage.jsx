import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import AppriseLogo from "../../components/appriseLogo/AppriseLogo";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import "./loginPage.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Credit from "../../ui/credit/Credit";
import { trimObjectValues } from "../../utils/utilFunctions";
import { useEffect } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      logIn(trimObjectValues(formData));
    } else {
      validateOtp(trimObjectValues(formData));
    }
  };

 // console.log("formData: ", formData);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const {
    mutate: logIn,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data?.error) throw new Error(data.error);

        if(!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // console.log(data);
      toast.success("OTP Sent successfully!");
      setOtpSent(true);
      setTimeLeft(300); // 5 minutes = 300 seconds
      //queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const { mutate: validateOtp, isPending: isValidatingOtp } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/auth/validate-login", {
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
      toast.success("LoggedIn Successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="log-in-page">
      <div className="left-sec">
        <AppriseLogo style={{ fontSize: "32px" }} />
      </div>
      <div className="right-sec">
        <h1>Lets go.</h1>
        <form
          className="log-in-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
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

          <Button className="auth-btn">
            {isPending ? "Loading" : "Login"}
          </Button>
          {isError && <p className="error-msg">{error.message}</p>}
        </form>
        <div className="bottom-navigation">
          <p>Don't have an account?</p>

          <Button
            className="invert-btn auth-btn"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Button>
        </div>
        <Credit style={{ fontSize: "15px" }} />
      </div>
    </div>
  );
};
export default LoginPage;
