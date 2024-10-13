import React from "react";
import "./input.scss";

const Input = ({
  inputIcon = "",
  isTextarea = false,
  className = "",
  ...props
}) => {
  return (
    <div className={"custom-input-container" + " " + className}>
      {inputIcon !== "" && <span className="input-icon">{inputIcon}</span>}

      {isTextarea ? (
        <textarea
          className={`custom-input ${
            inputIcon !== "" ? "input-with-icon" : ""
          }`}
          {...props}
        />
      ) : (
        <input
          className={`custom-input ${
            inputIcon !== "" ? "input-with-icon" : ""
          }`}
          {...props}
        />
      )}
    </div>
  );
};

export default Input;
