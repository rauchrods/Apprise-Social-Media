import React from "react";

import "./appriseLogo.scss";

const AppriseLogo = ({...props}) => {
  return (
    <div className="apprise-logo" {...props}>
      <h2>Apprise</h2>
    </div>
  );
};

export default AppriseLogo;
