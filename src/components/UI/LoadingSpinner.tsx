import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-center items-center h-screen">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
