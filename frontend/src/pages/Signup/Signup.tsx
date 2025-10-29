import React, { useState } from "react";
import InputField from "./InputField";
import "./SignupStyles.css";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { registerUser } from "../../store/slices/authSlice";
import SignupLogo from "./SignupLogo";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");

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

    const result = await dispatch(registerUser({ email, password, fullName }));
    if (registerUser.fulfilled.match(result)) navigate("/");
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-card">
          <div className="text-center mb-4">
            <SignupLogo />
          </div>
          <div className="text-center mb-4">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Sign Up to Get Started</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column" style={{ gap: "1.25rem" }}>
              {(localError || error) && (
                <div className="alert alert-danger" role="alert">
                  {localError || error}
                </div>
              )}
              <div>
                <label className="input-label">Full Name</label>
                <InputField
                  type="text"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={<User className="icon-size" />}
                  required
                />
              </div>
              <div>
                <label className="input-label">Email Address</label>
                <InputField
                  type="email"
                  placeholder="Enter your e-mail address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="icon-size" />}
                  required
                />
              </div>
              <div>
                <label className="input-label">Password</label>
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="icon-size" />}
                  toggleVisibility={togglePasswordVisibility}
                  showPassword={showPassword}
                  required
                />
              </div>
              <div>
                <label className="input-label">Confirm Password</label>
                <InputField
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="icon-size" />}
                  toggleVisibility={toggleConfirmPasswordVisibility}
                  showPassword={showConfirmPassword}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-signup w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>
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
