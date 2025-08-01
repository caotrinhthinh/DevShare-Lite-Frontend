import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
  const location = useLocation();

  const redirectTo =
    new URLSearchParams(location.search).get("redirectTo") || "/";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
};

export default LoginPage;
