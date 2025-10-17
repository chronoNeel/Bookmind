import React, { useState } from "react";
import InputField from "./InputField";
import "./SignupStyles.css";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { registerUser } from "../../store/slices/authSlice";
import SignupLogo from "./SignupLogo";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [fullName, setfullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [localError, setLocalError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!fullName.trim()) {
      setLocalError("Full name is required");
      return;
    }

    if (!email.trim()) {
      setLocalError("Email is required");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match!");
      return;
    }

    const result = await dispatch(
      registerUser({ email, password, fullName: fullName })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="signup-container">
        <div className="signup-card">
          {/* Logo */}
          <div className="text-center mb-4">
            <SignupLogo />
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Sign Up to Get Started</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column" style={{ gap: "1.25rem" }}>
              {/* Error Alert */}
              {(localError || error) && (
                <div className="alert alert-danger" role="alert">
                  {localError || error}
                </div>
              )}

              {/* Full Name Input */}
              <div>
                <label className="input-label">Full Name</label>
                <InputField
                  type="text"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setfullName(e.target.value)
                  }
                  icon={<User className="icon-size" />}
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="input-label">Email Address</label>
                <InputField
                  type="email"
                  placeholder="Enter your e-mail address"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  icon={<Mail className="icon-size" />}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="input-label">Password</label>
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  icon={<Lock className="icon-size" />}
                  toggleVisibility={togglePasswordVisibility}
                  showPassword={showPassword}
                  required
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="input-label">Confirm Password</label>
                <InputField
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  icon={<Lock className="icon-size" />}
                  toggleVisibility={toggleConfirmPasswordVisibility}
                  showPassword={showConfirmPassword}
                  required
                />
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="btn btn-signup w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div
            className="text-center mt-4 pt-3"
            style={{ borderTop: "1px solid rgba(139, 111, 71, 0.2)" }}
          >
            <p
              className="fw-medium text-dark mb-0"
              style={{ color: "#5d4a2f" }}
            >
              Already have an account?{" "}
              <a href="/login" className="login-link">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
