import React from "react";
import "./input.scss";

const Input = React.forwardRef(
  (
    {
      inputIcon = "",
      isTextarea = false,
      className = "",
      iconAction = () => {},
      ...props
    },
    ref
  ) => {
    return (
      <div className={"custom-input-container" + " " + className}>
        {inputIcon !== "" && (
          <span
            className="input-icon"
            onClick={iconAction}
            style={iconAction && { cursor: "pointer" }}
          >
            {inputIcon}
          </span>
        )}

        {isTextarea ? (
          <textarea
            ref={ref}
            className={`custom-input ${
              inputIcon !== "" ? "input-with-icon" : ""
            }`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            className={`custom-input ${
              inputIcon !== "" ? "input-with-icon" : ""
            }`}
            {...props}
          />
        )}
      </div>
    );
  }
);

// Input.displayName = 'Input';

export default Input;
