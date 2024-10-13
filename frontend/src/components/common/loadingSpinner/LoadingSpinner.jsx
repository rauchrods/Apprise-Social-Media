import React from "react";
import "./loadingSpinner.scss";

const LoadingSpinner = ({ size }) => {
  return (
    <span
      class="loader"
      style={{
        width: size,
        height: size,
      }}
    ></span>
  );
};

export default LoadingSpinner;
