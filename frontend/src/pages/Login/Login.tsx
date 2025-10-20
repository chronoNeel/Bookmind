// Login.tsx

import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextRevealAnimation from "./TextRevealAnimation";
import { loginUser } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../hooks/redux";
import LoginForm from "./LoginForm";
import LoginBackground from "./LoginBackground";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showTextReveal, setShowTextReveal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginUser({ email, password }) as any);

      if (!("error" in result)) {
        // Navigate to animation page immediately
        navigate("/login-success");
      } else {
        alert(result.error.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // Remove the showTextReveal logic from the component

  if (showTextReveal) {
    return <TextRevealAnimation />;
  }

  return (
    <LoginBackground>
      <LoginForm
        email={email}
        password={password}
        showPassword={showPassword}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={togglePasswordVisibility}
        onSubmit={handleLogin}
      />
    </LoginBackground>
  );
};

export default Login;
