import React, { useState } from "react";
import AppriseLogo from "../../components/appriseLogo/AppriseLogo";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";
import "./SignUpPage.scss";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isError = false;

  return (
    <div className="sign-up-page">
      <div className="left-sec">
        <AppriseLogo style={{ fontSize: "32px" }} />
      </div>
      <div className="right-sec">
        <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
        <form className="sign-up-form" onSubmit={handleSubmit}>
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
            name="username"
            onChange={handleInputChange}
            value={formData.username}
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

          <Button className="auth-btn">{"Sign up"}</Button>
          {isError && <p className="error-msg">Something went wrong</p>}
        </form>
        <div className="bottom-navigation">
          <p>Already have an account?</p>

          <Button
            className="invert-btn auth-btn"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
