import React from "react";
import { Heart } from "lucide-react";

interface DailyTipProps {
  tip: string;
}

const DailyTip: React.FC<DailyTipProps> = ({ tip }) => (
  <div className="card border-0 rounded-3 overflow-hidden shadow-sm">
    <div
      className="card-body p-4"
      style={{
        backgroundColor: "#9B7E6B",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Paper/Wood Texture Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(90deg, transparent 79px, rgba(255, 250, 234, 0.04) 79px, rgba(255, 250, 234, 0.04) 81px, transparent 81px),
            linear-gradient(rgba(255, 250, 234, 0.04) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(255, 250, 234, 0.03) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "100% 100%, 100% 8px, 8px 100%",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      {/* Subtle Noise Texture */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.1,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Wood Grain Effect */}
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
            rgba(255, 250, 234, 0.02) 2px,
            rgba(255, 250, 234, 0.02) 4px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 80px,
            rgba(255, 250, 234, 0.025) 80px,
            rgba(255, 250, 234, 0.025) 82px
          )
        `,
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h3 className="card-title h6 fw-bold text-white mb-2 d-flex align-items-center">
          <Heart className="me-2" size={16} /> Daily Tip
        </h3>
        <p className="card-text text-white small mb-0">{tip}</p>
      </div>
    </div>
  </div>
);

export default DailyTip;
