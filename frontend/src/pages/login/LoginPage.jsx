import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import AppriseLogo from "../../components/appriseLogo/AppriseLogo";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";

import "./loginPage.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
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
    <div className="log-in-page">
      <div className="left-sec">
        <AppriseLogo style={{ fontSize: "32px" }} />
      </div>
      <div className="right-sec">
        <h1>Lets go.</h1>
        <form className="log-in-form" onSubmit={handleSubmit}>
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

          <Button className="auth-btn">{"Login"}</Button>
          {isError && <p className="error-msg">Something went wrong</p>}
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
      </div>
    </div>
  );
};
export default LoginPage;
