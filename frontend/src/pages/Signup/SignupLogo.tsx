import React from "react";
import assets from "../../assets/asstes";

const SignupLogo: React.FC = () => {
  return (
    <div className="d-flex justify-content-center">
      <img
        src={assets.bookmind_nav}
        alt="BookMind Logo"
        width={230}
        className="mx-auto mb-1"
      />
    </div>
  );
};

export default SignupLogo;
