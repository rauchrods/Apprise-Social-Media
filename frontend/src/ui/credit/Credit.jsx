import React from "react";
import "./credit.scss";
const Credit = ({ ...props }) => {
  return (
    <div className="credit-text" {...props}>
      <a
        href={"https://rauchrodrigues.vercel.app/"}
        target="_blank"
        rel="noreferrer noopener"
      >
        A Rauch Rodrigues Product
      </a>
    </div>
  );
};

export default Credit;
