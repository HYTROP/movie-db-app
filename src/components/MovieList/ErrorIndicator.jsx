import React from "react";
import "./ErrorIndicator.css";

const ErrorIndicator = () => {
  return (
    <div className="error-page">
      <div className="text-error-message">
        <span>Something went wrong</span>
      </div>

      <div className="container">
        <div className="circle-border"></div>
        <div className="circle">
          <div className="error"></div>
        </div>
      </div>
    </div>
  );
};

export default ErrorIndicator;
