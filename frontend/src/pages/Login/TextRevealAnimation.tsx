// TextRevealAnimation.tsx

import React from "react";

const TextRevealAnimation = () => {
  const text = "BOOKMIND";
  const letters = text.split("");

  return (
    <>
      <style>{`
        @keyframes revealLetter {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-10px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes revealSubtitle {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .letter-reveal {
          opacity: 0;
          transform: translateY(32px);
          animation: revealLetter 0.8s ease-out forwards;
        }

        .subtitle-reveal {
          opacity: 0;
          animation: revealSubtitle 1s ease-out forwards;
        }

        .loading-dot {
          animation: bounce 1.5s infinite;
        }
      `}</style>

      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-white d-flex align-items-center justify-content-center"
        style={{ zIndex: 9999 }}
      >
        <div className="text-center">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ gap: "0.25rem" }}
          >
            {letters.map((letter, index) => (
              <span
                key={index}
                className="letter-reveal fw-bold text-dark"
                style={{
                  fontSize: "6rem",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          {/* Loading dots */}
          <div
            className="d-flex justify-content-center mt-2 subtitle-reveal"
            style={{
              gap: "0.5rem",
              animationDelay: `${letters.length * 0.1 + 1}s`,
            }}
          >
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className="loading-dot rounded-circle bg-secondary"
                style={{
                  width: "12px",
                  height: "12px",
                  animationDelay: `${dot * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TextRevealAnimation;
