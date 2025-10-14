// LoginBackground.tsx

import React from "react";

interface LoginBackgroundProps {
  children: React.ReactNode;
}

const LoginBackground: React.FC<LoginBackgroundProps> = ({ children }) => {
  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <div
        className="min-vh-100 position-relative overflow-hidden text-dark p-3 p-md-4"
        style={{
          background: "linear-gradient(135deg, #fffaea 50%)",
        }}
      >
        {/* Paper texture overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            pointerEvents: "none",
            opacity: 0.3,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0826d' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div className="position-relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default LoginBackground;
