import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../hooks/redux";
import LoginForm from "./LoginForm";
import LoginBackground from "./LoginBackground";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result) navigate("/login-success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

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
