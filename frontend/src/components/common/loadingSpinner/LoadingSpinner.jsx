import React from "react";
import "./loadingSpinner.scss";

const LoadingSpinner = ({ size, ...props }) => {
  return (
    <span
      className="loader"
      style={{
        width: size,
        height: size,
      }}
      {...props}
    ></span>
  );
};

export default LoadingSpinner;
