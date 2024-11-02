import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import AppriseLogo from "../../components/appriseLogo/AppriseLogo";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";

import "./loginPage.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Credit from "../../ui/credit/Credit";

const LoginPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutate, isError, error, isPending } = useMutation({
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

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Logged In successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
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
          <Input
            inputIcon={<MdOutlineMail />}
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
            value={formData.email}
          />

          <Input
            inputIcon={<MdPassword />}
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
            value={formData.password}
          />

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
