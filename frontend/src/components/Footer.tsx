import React from "react";
import { useNavigate } from "react-router-dom";
import bookmind from "../assets/Bookmind.svg";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer
      style={{
        backgroundColor: "#4F200D",
        color: "#FFFAEA",
        borderTop: "1px solid rgba(255, 250, 234, 0.15)",
        position: "relative",
        overflow: "hidden",
      }}
      className="py-16 px-4 mt-auto"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(90deg, transparent 79px, rgba(255, 250, 234, 0.03) 79px, rgba(255, 250, 234, 0.03) 81px, transparent 81px),
            linear-gradient(rgba(255, 250, 234, 0.03) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(255, 250, 234, 0.02) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "100% 100%, 100% 8px, 8px 100%",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.08,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 250, 234, 0.015) 2px,
              rgba(255, 250, 234, 0.015) 4px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 80px,
              rgba(255, 250, 234, 0.02) 80px,
              rgba(255, 250, 234, 0.02) 82px
            )
          `,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      <div
        className="container mx-auto max-w-7xl"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="row align-items-center">
          {/* Left: Logo */}
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src={bookmind}
              alt="BookMind Logo"
              className="img-fluid"
              style={{
                height: "auto",
                width: "280px",
                maxWidth: "280px",
                cursor: "pointer",
                objectFit: "contain",
                filter: "invert(1) brightness(1.1)",
                transition: "all 0.3s ease",
              }}
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.filter = "invert(1) brightness(1.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "invert(1) brightness(1.1)";
              }}
            />
          </div>

          {/* Right: Tagline and Copyright */}
          <div className="col-md-6 text-md-end d-flex flex-column align-items-md-end">
            <p
              style={{
                opacity: 0.9,
                letterSpacing: "2px",
                fontWeight: "300",
                fontSize: "18px",
              }}
              className="mb-3"
            >
              Read. Think. Grow.
            </p>
            <p
              style={{
                opacity: 0.6,
                letterSpacing: "0.5px",
                fontWeight: "300",
                fontSize: "14px",
              }}
              className="mb-0"
            >
              © 2025 BookMind. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
