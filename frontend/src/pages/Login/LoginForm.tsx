// LoginForm.tsx

import React, { FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import LoginLogo from "./LoginLogo";
import "./LoginStyles.css";

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}) => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-card">
        {/* Logo */}
        <div className="text-center mb-4">
          <LoginLogo />
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="login-title">Welcome To Bookmind</h1>
          <p className="login-subtitle">Login to Continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit}>
          <div className="d-flex flex-column" style={{ gap: "1.5rem" }}>
            {/* Email Input */}
            <div>
              <label className="input-label">Email Address</label>
              <div className="input-group-custom">
                <div className="input-icon">
                  <Mail className="icon-size" />
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className="form-control-custom"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="input-label">Password</label>
              <div className="input-group-custom">
                <div className="input-icon">
                  <Lock className="icon-size" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  className="form-control-custom"
                  required
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="btn-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="icon-size" />
                  ) : (
                    <Eye className="icon-size" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-login w-100 mt-3">
              Login
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div
          className="text-center mt-4 pt-3"
          style={{ borderTop: "1px solid rgba(139, 111, 71, 0.2)" }}
        >
          <p className="fw-medium text-dark mb-0" style={{ color: "#5d4a2f" }}>
            New User?{" "}
            <a href="/signup" className="signup-link">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
