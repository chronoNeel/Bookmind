// SignupLogo.tsx

import React from "react";
import { assets } from "../../assets/asstes";

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

/* 
INSTRUCTIONS TO USE YOUR LOGO:
1. Replace the entire <svg> element above with your logo's SVG code
2. Adjust width and height props as needed (currently set to 80x80)
3. Make sure your SVG has proper viewBox attributes
4. If your logo has colors, they should complement the warm paper theme (#fffaea background)
*/
