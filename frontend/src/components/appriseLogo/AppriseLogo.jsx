import React from "react";

import "./appriseLogo.scss";

const AppriseLogo = ({ text = "Apprise", ...props }) => {
  return (
    <div className="apprise-logo" {...props}>
      <h2>{text}</h2>
    </div>
  );
};

export default AppriseLogo;
